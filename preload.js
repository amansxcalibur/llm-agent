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

const { contextBridge, ipcRenderer, net } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  activateApp: () => ipcRenderer.send('activate-app')
});

contextBridge.exposeInMainWorld("api", {
	sendFormData: ()=>{
		const node=document.createElement('div');
		const innerText=document.createElement('textarea');
		const input=document.getElementById('chat-box').value;
		const textnode = document.createTextNode(input);
		innerText.classList.add('user-text');
		node.classList.add('user-text-container')
		innerText.appendChild(textnode);
		node.appendChild(innerText)
		document.getElementById("content").appendChild(node);
		if (document.getElementById('welcome')){
			document.getElementById('welcome').remove();
		}
		document.getElementById('chat-box').value="";
		return input;
	},
	checkFormData: ()=>{
		document.getElementById('chat-box').value="";
		document.getElementById('chat-box').placeholder="Get started"
	},
	getData: (prompt)=> {
		const url = "http://localhost:8000/send_prompt";
		fetch(url,
			{
				method: 'POST',
				headers: {
					'Content-Type':'application/json',
					'accept': 'application/json'
				},
				body:JSON.stringify({
					content:prompt
				})
			}
		)
		.then(response=>{
			 return response.json();
		})
		.then(data=>{
			const machine=data.message;
			const noder=document.createElement('div');
			const textnode = document.createTextNode(machine);
			noder.classList.add('machine-text');
			noder.appendChild(textnode);
			document.getElementById("content").appendChild(noder)
		})
	  }
})
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;




	