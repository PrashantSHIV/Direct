const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const MyLifeFlow = require('./models/MyLifeFlow');
const SDLifeCycle = require('./models/SDLifeCycle');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "assets","app.png"), // app icon for production
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (app.isPackaged) {
    // ✅ Load Next.js production build (after `next build && next export`)
    mainWindow.loadFile(path.join(__dirname, 'out', 'index.html'));
    console.log(app.isPackaged);
    
  } else {
    // ✅ Dev mode: load local server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});


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

// Subjects handlers
ipcMain.handle('get-subjects', async () => {
  try {
    return MyLifeFlow.getSubjects();
  } catch (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
});

ipcMain.handle('add-subjects', async (event, name, reason) => {
  try {
    MyLifeFlow.addSubjects(name, reason);
    return { success: true };
  } catch (error) {
    console.error('Error adding subjects:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-subjects', async (event, id, name, reason) => {
  try {
    MyLifeFlow.updateSubjects(id, name, reason);
    return { success: true };
  } catch (error) {
    console.error('Error updating subjects:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-subjects', async (event, id) => {
  try {
    MyLifeFlow.deleteSubjects(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting subjects:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-subjects', async (event, newOrder) => {
  try {
    await MyLifeFlow.reorderSubjects(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering subjects:', error);
    return { success: false, error: error.message };
  }
});

// Mind handlers
ipcMain.handle('get-mind', async () => {
  try {
    return MyLifeFlow.getMind();
  } catch (error) {
    console.error('Error getting mind:', error);
    return [];
  }
});

ipcMain.handle('add-mind', async (event, section_name, technique_name, technique_steps) => {
  try {
    MyLifeFlow.addMind(section_name, technique_name, technique_steps);
    return { success: true };
  } catch (error) {
    console.error('Error adding mind:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-mind', async (event, id, section_name, technique_name, technique_steps) => {
  try {
    MyLifeFlow.updateMind(id, section_name, technique_name, technique_steps);
    return { success: true };
  } catch (error) {
    console.error('Error updating mind:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-mind', async (event, id) => {
  try {
    MyLifeFlow.deleteMind(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting mind:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-mind-items', async (event, section_name, newOrder) => {
  try {
    await MyLifeFlow.reorderMindItems(section_name, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering mind items:', error);
    return { success: false, error: error.message };
  }
});

// Body Exercise handlers
ipcMain.handle('get-exercise', async () => {
  try {
    return MyLifeFlow.getExercise();
  } catch (error) {
    console.error('Error getting exercise:', error);
    return [];
  }
});

ipcMain.handle('add-exercise', async (event, section_name, technique_name, technique_steps) => {
  try {
    MyLifeFlow.addExercise(section_name, technique_name, technique_steps);
    return { success: true };
  } catch (error) {
    console.error('Error adding exercise:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-exercise', async (event, id, section_name, technique_name, technique_steps) => {
  try {
    MyLifeFlow.updateExercise(id, section_name, technique_name, technique_steps);
    return { success: true };
  } catch (error) {
    console.error('Error updating exercise:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-exercise', async (event, id) => {
  try {
    MyLifeFlow.deleteExercise(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-exercise', async (event, section_name, newOrder) => {
  try {
    await MyLifeFlow.reorderExercise(section_name, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering exercise items:', error);
    return { success: false, error: error.message };
  }
});

// Body Day Table handlers
ipcMain.handle('get-day-table', async () => {
  try {
    return MyLifeFlow.getDayTable();
  } catch (error) {
    console.error('Error getting day table:', error);
    return [];
  }
});

ipcMain.handle('add-day-table', async (event, day, reps, sets, exercise_name) => {
  try {
    MyLifeFlow.addDayTable(day, reps, sets, exercise_name);
    return { success: true };
  } catch (error) {
    console.error('Error adding day table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-day-table', async (event, id, day, reps, sets, exercise_name) => {
  try {
    MyLifeFlow.updateDayTable(id, day, reps, sets, exercise_name);
    return { success: true };
  } catch (error) {
    console.error('Error updating day table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-day-table', async (event, id) => {
  try {
    MyLifeFlow.deleteDayTable(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting day table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-day-table', async (event, day, newOrder) => {
  try {
    await MyLifeFlow.reorderDayTable(day, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering day table items:', error);
    return { success: false, error: error.message };
  }
});

// Body Diet Table handlers
ipcMain.handle('get-diet-table', async () => {
  try {
    return MyLifeFlow.getDietTable();
  } catch (error) {
    console.error('Error getting diet table:', error);
    return [];
  }
});

ipcMain.handle('add-diet-table', async (event, name, benefits) => {
  try {
    MyLifeFlow.addDietTable(name, benefits);
    return { success: true };
  } catch (error) {
    console.error('Error adding diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-diet-table', async (event, id, name, benefits) => {
  try {
    MyLifeFlow.updateDietTable(id, name, benefits);
    return { success: true };
  } catch (error) {
    console.error('Error updating diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-diet-table', async (event, id) => {
  try {
    MyLifeFlow.deleteDietTable(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-diet-table', async (event, newOrder) => {
  try {
    await MyLifeFlow.reorderDietTable(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering diet table items:', error);
    return { success: false, error: error.message };
  }
});

// Body Daily Diet Table handlers
ipcMain.handle('get-daily-diet-table', async () => {
  try {
    return MyLifeFlow.getDailyDietTable();
  } catch (error) {
    console.error('Error getting daily diet table:', error);
    return [];
  }
});

ipcMain.handle('add-daily-diet-table', async (event, day, diet_name, quantity) => {
  try {
    MyLifeFlow.addDailyDietTable(day, diet_name, quantity);
    return { success: true };
  } catch (error) {
    console.error('Error adding daily diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-daily-diet-table', async (event, id, day, diet_name, quantity) => {
  try {
    MyLifeFlow.updateDailyDietTable(id, day, diet_name, quantity);
    return { success: true };
  } catch (error) {
    console.error('Error updating daily diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-daily-diet-table', async (event, id) => {
  try {
    MyLifeFlow.deleteDailyDietTable(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting daily diet table:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-daily-diet-table', async (event, day, newOrder) => {
  try {
    await MyLifeFlow.reorderDailyDietTable(day, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering daily diet table items:', error);
    return { success: false, error: error.message };
  }
});

// Goals handlers
ipcMain.handle('get-goals', async () => {
  try {
    return MyLifeFlow.getGoals();
  } catch (error) {
    console.error('Error getting goals:', error);
    return [];
  }
});

ipcMain.handle('add-goals', async (event, goal, reason, duration) => {
  try {
    MyLifeFlow.addGoals(goal, reason, duration);
    return { success: true };
  } catch (error) {
    console.error('Error adding goals:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-goals', async (event, id, goal, reason, duration) => {
  try {
    MyLifeFlow.updateGoals(id, goal, reason, duration);
    return { success: true };
  } catch (error) {
    console.error('Error updating goals:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-goals', async (event, id) => {
  try {
    MyLifeFlow.deleteGoals(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting goals:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-goals', async (event, newOrder) => {
  try {
    await MyLifeFlow.reorderGoals(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering goals:', error);
    return { success: false, error: error.message };
  }
});

// Remember handlers
ipcMain.handle('get-remember', async () => {
  try {
    return MyLifeFlow.getRemember();
  } catch (error) {
    console.error('Error getting remember:', error);
    return [];
  }
});

ipcMain.handle('add-remember', async (event, what, why) => {
  try {
    MyLifeFlow.addRemember(what, why);
    return { success: true };
  } catch (error) {
    console.error('Error adding remember:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-remember', async (event, id, what, why) => {
  try {
    MyLifeFlow.updateRemember(id, what, why);
    return { success: true };
  } catch (error) {
    console.error('Error updating remember:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-remember', async (event, id) => {
  try {
    MyLifeFlow.deleteRemember(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting remember:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-remember', async (event, newOrder) => {
  try {
    await MyLifeFlow.reorderRemember(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering remember items:', error);
    return { success: false, error: error.message };
  }
});

// Task handlers
ipcMain.handle('get-task', async () => {
  try {
    return MyLifeFlow.getTask();
  } catch (error) {
    console.error('Error getting task:', error);
    return [];
  }
});

ipcMain.handle('add-task', async (event, task) => {
  try {
    MyLifeFlow.addTask(task);
    return { success: true };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-task', async (event, id, task, status) => {
  try {
    MyLifeFlow.updateTask(id, task, status);
    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-task', async (event, id) => {
  try {
    MyLifeFlow.deleteTask(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-tasks', async (event, newOrder) => {
  try {
    await MyLifeFlow.reorderTasks(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return { success: false, error: error.message };
  }
});

// SD Life Cycle IPC Handlers

// Definitions
ipcMain.handle('get-definitions', async () => {
  try {
    return await SDLifeCycle.getDefinitions();
  } catch (error) {
    console.error('Error getting definitions:', error);
    return [];
  }
});

ipcMain.handle('add-definition', async (event, title, explanation) => {
  try {
    await SDLifeCycle.addDefinition(title, explanation);
    return { success: true };
  } catch (error) {
    console.error('Error adding definition:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-definition', async (event, id, title, explanation) => {
  try {
    await SDLifeCycle.updateDefinition(id, title, explanation);
    return { success: true };
  } catch (error) {
    console.error('Error updating definition:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-definition', async (event, id) => {
  try {
    await SDLifeCycle.deleteDefinition(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting definition:', error);
    return { success: false, error: error.message };
  }
});

// Phases
ipcMain.handle('get-phases', async () => {
  try {
    return await SDLifeCycle.getPhases();
  } catch (error) {
    console.error('Error getting phases:', error);
    return [];
  }
});

ipcMain.handle('add-phase', async (event, name) => {
  try {
    await SDLifeCycle.addPhase(name);
    return { success: true };
  } catch (error) {
    console.error('Error adding phase:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-phase', async (event, id, name) => {
  try {
    await SDLifeCycle.updatePhase(id, name);
    return { success: true };
  } catch (error) {
    console.error('Error updating phase:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-phase', async (event, id) => {
  try {
    await SDLifeCycle.deletePhase(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phase:', error);
    return { success: false, error: error.message };
  }
});

// Phase Definitions
ipcMain.handle('get-phase-definitions', async (event, phaseId) => {
  try {
    return await SDLifeCycle.getPhaseDefinitions(phaseId);
  } catch (error) {
    console.error('Error getting phase definitions:', error);
    return [];
  }
});

ipcMain.handle('add-phase-definition', async (event, phaseId, title, explanation) => {
  try {
    await SDLifeCycle.addPhaseDefinition(phaseId, title, explanation);
    return { success: true };
  } catch (error) {
    console.error('Error adding phase definition:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-phase-definition', async (event, id, title, explanation) => {
  try {
    await SDLifeCycle.updatePhaseDefinition(id, title, explanation);
    return { success: true };
  } catch (error) {
    console.error('Error updating phase definition:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-phase-definition', async (event, id) => {
  try {
    await SDLifeCycle.deletePhaseDefinition(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phase definition:', error);
    return { success: false, error: error.message };
  }
});

// Phase Tools
ipcMain.handle('get-phase-tools', async (event, phaseId) => {
  try {
    return await SDLifeCycle.getPhaseTools(phaseId);
  } catch (error) {
    console.error('Error getting phase tools:', error);
    return [];
  }
});

ipcMain.handle('add-phase-tool', async (event, phaseId, name, source) => {
  try {
    await SDLifeCycle.addPhaseTool(phaseId, name, source);
    return { success: true };
  } catch (error) {
    console.error('Error adding phase tool:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-phase-tool', async (event, id, name, source) => {
  try {
    await SDLifeCycle.updatePhaseTool(id, name, source);
    return { success: true };
  } catch (error) {
    console.error('Error updating phase tool:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-phase-tool', async (event, id) => {
  try {
    await SDLifeCycle.deletePhaseTool(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phase tool:', error);
    return { success: false, error: error.message };
  }
});

// Phase Steps
ipcMain.handle('get-phase-steps', async (event, phaseId) => {
  try {
    return await SDLifeCycle.getPhaseSteps(phaseId);
  } catch (error) {
    console.error('Error getting phase steps:', error);
    return [];
  }
});

ipcMain.handle('add-phase-step', async (event, phaseId, step, reason) => {
  try {
    await SDLifeCycle.addPhaseStep(phaseId, step, reason);
    return { success: true };
  } catch (error) {
    console.error('Error adding phase step:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-phase-step', async (event, id, step, reason) => {
  try {
    await SDLifeCycle.updatePhaseStep(id, step, reason);
    return { success: true };
  } catch (error) {
    console.error('Error updating phase step:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-phase-step', async (event, id) => {
  try {
    await SDLifeCycle.deletePhaseStep(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phase step:', error);
    return { success: false, error: error.message };
  }
});

// Projects
ipcMain.handle('get-projects', async () => {
  try {
    return await SDLifeCycle.getProjects();
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
});

ipcMain.handle('add-project', async (event, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => {
  try {
    await SDLifeCycle.addProject(name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status);
    return { success: true };
  } catch (error) {
    console.error('Error adding project:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-project', async (event, id, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => {
  try {
    await SDLifeCycle.updateProject(id, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status);
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-project', async (event, id) => {
  try {
    await SDLifeCycle.deleteProject(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
});

// Reordering handlers
ipcMain.handle('reorder-definitions', async (event, newOrder) => {
  try {
    await SDLifeCycle.reorderDefinitions(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering definitions:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-phase-definitions', async (event, phaseId, newOrder) => {
  try {
    await SDLifeCycle.reorderPhaseDefinitions(phaseId, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering phase definitions:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-phase-tools', async (event, phaseId, newOrder) => {
  try {
    await SDLifeCycle.reorderPhaseTools(phaseId, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering phase tools:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-phase-steps', async (event, phaseId, newOrder) => {
  try {
    await SDLifeCycle.reorderPhaseSteps(phaseId, newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering phase steps:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reorder-projects', async (event, newOrder) => {
  try {
    await SDLifeCycle.reorderProjects(newOrder);
    return { success: true };
  } catch (error) {
    console.error('Error reordering projects:', error);
    return { success: false, error: error.message };
  }
});

// Open external URL in system browser
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('Error opening external URL:', error);
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