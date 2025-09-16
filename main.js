const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const MyLifeFlow = require('./models/MyLifeFlow');

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
  mainWindow.webContents.openDevTools();
}

// IPC Handlers for database operations
ipcMain.handle('get-timetable', async () => {
  try {
    return MyLifeFlow.getTimetable();
  } catch (error) {
    console.error('Error getting timetable:', error);
    return [];
  }
});

ipcMain.handle('add-timetable', async (event, type, time, discipline) => {
  try {
    MyLifeFlow.addTimetable(type, time, discipline);
    return { success: true };
  } catch (error) {
    console.error('Error adding timetable:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-timetable', async (event, id, type, time, discipline) => {
  try {
    MyLifeFlow.updateTimetable(id, type, time, discipline);
    return { success: true };
  } catch (error) {
    console.error('Error updating timetable:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-timetable', async (event, id) => {
  try {
    MyLifeFlow.deleteTimetable(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting timetable:', error);
    return { success: false, error: error.message };
  }
});

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