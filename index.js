const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
	autoHideMenuBar: true,
	webPreferences:{
		preload: '/Desktop/amFOSS/LLM-agent/llm-agent/preload.js'
	}
	
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

"use strict"

require("./App");

const { ipcMain } = require("electron");

// const getMyFriends = () => {
// 	return [
// 		{id: 6030, name: "Twilley"},
// 		{id: 967, name: "Wickkiser"},
// 		{id: 5073, name: "Essick"},
// 		{id: 8886, name: "Marotta"},
// 		{id: 7416, name: "Banh"}
// 	];	
// }

// const sendMessage = (message) => {
// 	console.log(message);
// }

// ipcMain
// 	.on("main-window-ready", (e) => {
// 		console.log("Main window is ready");
// 	})
// 	.on("send-message", (e, message) => {
// 		sendMessage(message);
// 	})

// ipcMain.handle("get-friends", (e) => {
// 	return getMyFriends();
// })

ipcMain.on('activate-app', ()=>{
	console.log('Voice activation successful');
	if(win){
		win.show();
	}
})