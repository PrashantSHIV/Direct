const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  ping: () => 'pong',
  getTimetable: () => ipcRenderer.invoke('get-timetable'),
  addTimetable: (type, time, discipline) => ipcRenderer.invoke('add-timetable', type, time, discipline),
  updateTimetable: (id, type, time, discipline) => ipcRenderer.invoke('update-timetable', id, type, time, discipline),
  deleteTimetable: (id) => ipcRenderer.invoke('delete-timetable', id)
});