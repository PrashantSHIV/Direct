const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
        nodeIntegration: false,        // Security: Renderer can't access Node.js
        contextIsolation: true,        // Security: Isolates renderer from main
        preload: path.join(__dirname, 'preload.js')  // Loads our bridge script
      }
  });

  // Load your Next.js app
  mainWindow.loadURL('http://localhost:3000');

  // Open DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});