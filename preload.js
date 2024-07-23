const fs = require("fs");
const { WaveFile } = require("wavefile");
const wavEncoder = require("wav-encoder");
const record = require("node-record-lpcm16");
const { Cobra } = require("@picovoice/cobra-node");
const { PvRecorder } = require("@picovoice/pvrecorder-node");
const http = require("http");
// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
// 	sendMessage: () => {
// 		const chatBox = document.getElementById("chat-box");
// 		ipcRenderer.send("send-message", chatBox.value);
// 		chatBox.value = "";
// 	},
// 	getFriends: () => {
// 		return ipcRenderer.invoke("get-friends");
// 	}
// })

// window.addEventListener("DOMContentLoaded", () => {
// 	ipcRenderer.send("main-window-ready");
// })

const { contextBridge, ipcRenderer, protocol } = require("electron");

let audioRecorder;

const { Porcupine, BuiltinKeyword } = require("@picovoice/porcupine-node");
const accessKey = "hAwyKaRd8GX5wXo/91eFA8N1gFZFkRAyxHwotLDcihxtx1VJXZiM/A==";
let porcupine = new Porcupine(
  accessKey,
  ["/home/rice_test/llm-agent/hey_orca.ppn"],
  [0.6],
);
const frameLength = 512;

const recorder = new PvRecorder(frameLength, 2);
console.log(recorder.sampleRate);
recorder.start();
console.log(`Listening on: ${recorder.getSelectedDevice()}`);

const cobra = new Cobra(accessKey);

contextBridge.exposeInMainWorld("electronAPI", {
  activateApp: () => ipcRenderer.send("activate-app"),
});

let waitingForWake = true;
let waitingForCobra = true;
let talking = false;
let startStamp;
const speechThresholdTime = 1.5;
frames = [];

contextBridge.exposeInMainWorld("api", {
  startListening: async () => {
    while (waitingForWake) {
      const pcm = await recorder.read();
      let index = porcupine.process(pcm);
      if (index !== -1) {
        console.log("Detected Keyword, Starting cobra");
        waitingForWake = false;
      }
    }
    while (waitingForCobra) {
      const pcm = await recorder.read();
      if (talking) {
        frames.push(pcm);
      }
      const voiceProbability = cobra.process(pcm) * 100;
      if (voiceProbability > 80) {
        console.log("Start Speech");
        startStamp = Date.now();
        talking = true;
      }
      if (
        voiceProbability < 50 &&
        Date.now() - startStamp >= speechThresholdTime * 1000
      ) {
        const wav = new WaveFile();
        const audioData = new Int16Array(recorder.frameLength * frames.length);

        for (let i = 0; i < frames.length; i++) {
          audioData.set(frames[i], i * recorder.frameLength);
        }

        wav.fromScratch(1, recorder.sampleRate, "16", audioData);

        fs.writeFileSync("/home/rice_test/output.wav", wav.toBuffer());
        waitingForCobra = false;
        talking = false;
      }
    }
    console.log("End Speech");
  },
  sendFormData: () => {
    const node = document.createElement("div");
    const innerText = document.createElement("p");
    const input = document.getElementById("chat-box").value;
    const textnode = document.createTextNode(input);
    innerText.classList.add("user-text");
    node.classList.add("user-text-container");
    innerText.appendChild(textnode);
    node.appendChild(innerText);
    document.getElementById("content").appendChild(node);
    if (document.getElementById("welcome")) {
      document.getElementById("welcome").remove();
    }
    document.getElementById("chat-box").value = "";
    return input;
  },
  checkFormData: () => {
    document.getElementById("chat-box").value = "";
    document.getElementById("chat-box").placeholder = "Get started";
  },
  getData: (prompt) => {
    const url = "http://localhost:8000/send_prompt";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        content: prompt,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const machine_text = data.message;
        const noder = document.createElement("div");
        const textnode = document.createTextNode(machine_text);
        noder.classList.add("machine-text");
        noder.appendChild(textnode);
        if (data.url) {
          const machine_img_url = data.url;
          const img_elem = document.createElement("img");
          img_elem.src = machine_img_url;
          noder.appendChild(img_elem);
        }
        const logo = document.createElement("img");
        logo.src = "./ai2-unscreen.gif";
        logo.classList.add("side-logo");
        const test = document.createElement("div");
        test.appendChild(logo);
        test.appendChild(noder);
        test.style.display = "flex";
        document.getElementById("content").appendChild(test);
      });
  },
});
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
