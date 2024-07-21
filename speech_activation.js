const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Web Speech API is not supported by this browser.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.start();

  recognition.onstart = () => {
    console.log('Speech recognition service has started');
  };

  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim().toLowerCase();
    console.log('Voice Command:', command);

    if (command.includes('activate app')) {
      window.electronAPI.activateApp();
    }
  };

  recognition.onspeechend = () => {
    console.log('Speech recognition service disconnected');
    recognition.start();
  };

  recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert("Microphone access was denied. Please enable it in your browser settings.");
    }
  };
}
