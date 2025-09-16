const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  ping: () => 'pong',
  
  // TimeTable API
  getTimetable: () => ipcRenderer.invoke('get-timetable'),
  addTimetable: (type, time, discipline) => ipcRenderer.invoke('add-timetable', type, time, discipline),
  updateTimetable: (id, type, time, discipline) => ipcRenderer.invoke('update-timetable', id, type, time, discipline),
  deleteTimetable: (id) => ipcRenderer.invoke('delete-timetable', id),
  
        // Subjects API
        getSubjects: () => ipcRenderer.invoke('get-subjects'),
        addSubjects: (name, reason) => ipcRenderer.invoke('add-subjects', name, reason),
        updateSubjects: (id, name, reason) => ipcRenderer.invoke('update-subjects', id, name, reason),
        deleteSubjects: (id) => ipcRenderer.invoke('delete-subjects', id),
        reorderSubjects: (newOrder) => ipcRenderer.invoke('reorder-subjects', newOrder),
  
  // Mind API
  getMind: () => ipcRenderer.invoke('get-mind'),
  addMind: (section_name, technique_name, technique_steps) => ipcRenderer.invoke('add-mind', section_name, technique_name, technique_steps),
  updateMind: (id, section_name, technique_name, technique_steps) => ipcRenderer.invoke('update-mind', id, section_name, technique_name, technique_steps),
  deleteMind: (id) => ipcRenderer.invoke('delete-mind', id),
  reorderMindItems: (section_name, newOrder) => ipcRenderer.invoke('reorder-mind-items', section_name, newOrder),
  
  // Body Exercise API
  getExercise: () => ipcRenderer.invoke('get-exercise'),
  addExercise: (section_name, technique_name, technique_steps) => ipcRenderer.invoke('add-exercise', section_name, technique_name, technique_steps),
  updateExercise: (id, section_name, technique_name, technique_steps) => ipcRenderer.invoke('update-exercise', id, section_name, technique_name, technique_steps),
  deleteExercise: (id) => ipcRenderer.invoke('delete-exercise', id),
  reorderExercise: (section_name, newOrder) => ipcRenderer.invoke('reorder-exercise', section_name, newOrder),
  
  // Body Day Table API
  getDayTable: () => ipcRenderer.invoke('get-day-table'),
  addDayTable: (day, reps, sets, exercise_name) => ipcRenderer.invoke('add-day-table', day, reps, sets, exercise_name),
  updateDayTable: (id, day, reps, sets, exercise_name) => ipcRenderer.invoke('update-day-table', id, day, reps, sets, exercise_name),
  deleteDayTable: (id) => ipcRenderer.invoke('delete-day-table', id),
  reorderDayTable: (day, newOrder) => ipcRenderer.invoke('reorder-day-table', day, newOrder),
  
  // Body Diet Table API
  getDietTable: () => ipcRenderer.invoke('get-diet-table'),
  addDietTable: (name, benefits) => ipcRenderer.invoke('add-diet-table', name, benefits),
  updateDietTable: (id, name, benefits) => ipcRenderer.invoke('update-diet-table', id, name, benefits),
  deleteDietTable: (id) => ipcRenderer.invoke('delete-diet-table', id),
  reorderDietTable: (newOrder) => ipcRenderer.invoke('reorder-diet-table', newOrder),
  
  // Body Daily Diet Table API
  getDailyDietTable: () => ipcRenderer.invoke('get-daily-diet-table'),
  addDailyDietTable: (day, diet_name, quantity) => ipcRenderer.invoke('add-daily-diet-table', day, diet_name, quantity),
  updateDailyDietTable: (id, day, diet_name, quantity) => ipcRenderer.invoke('update-daily-diet-table', id, day, diet_name, quantity),
  deleteDailyDietTable: (id) => ipcRenderer.invoke('delete-daily-diet-table', id),
  reorderDailyDietTable: (day, newOrder) => ipcRenderer.invoke('reorder-daily-diet-table', day, newOrder),
  
  // Goals API
  getGoals: () => ipcRenderer.invoke('get-goals'),
  addGoals: (goal, reason, duration) => ipcRenderer.invoke('add-goals', goal, reason, duration),
  updateGoals: (id, goal, reason, duration) => ipcRenderer.invoke('update-goals', id, goal, reason, duration),
  deleteGoals: (id) => ipcRenderer.invoke('delete-goals', id),
  reorderGoals: (newOrder) => ipcRenderer.invoke('reorder-goals', newOrder),
  
  // Remember API
  getRemember: () => ipcRenderer.invoke('get-remember'),
  addRemember: (what, why) => ipcRenderer.invoke('add-remember', what, why),
  updateRemember: (id, what, why) => ipcRenderer.invoke('update-remember', id, what, why),
  deleteRemember: (id) => ipcRenderer.invoke('delete-remember', id),
  reorderRemember: (newOrder) => ipcRenderer.invoke('reorder-remember', newOrder),
  
        // Task API
        getTask: () => ipcRenderer.invoke('get-task'),
        addTask: (task) => ipcRenderer.invoke('add-task', task),
        updateTask: (id, task, status) => ipcRenderer.invoke('update-task', id, task, status),
        deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
        reorderTasks: (newOrder) => ipcRenderer.invoke('reorder-tasks', newOrder),
        
        // SD Life Cycle API
        // Definitions
        getDefinitions: () => ipcRenderer.invoke('get-definitions'),
        addDefinition: (title, explanation) => ipcRenderer.invoke('add-definition', title, explanation),
        updateDefinition: (id, title, explanation) => ipcRenderer.invoke('update-definition', id, title, explanation),
        deleteDefinition: (id) => ipcRenderer.invoke('delete-definition', id),
        
        // Phases
        getPhases: () => ipcRenderer.invoke('get-phases'),
        addPhase: (name) => ipcRenderer.invoke('add-phase', name),
        updatePhase: (id, name) => ipcRenderer.invoke('update-phase', id, name),
        deletePhase: (id) => ipcRenderer.invoke('delete-phase', id),
        
        // Phase Definitions
        getPhaseDefinitions: (phaseId) => ipcRenderer.invoke('get-phase-definitions', phaseId),
        addPhaseDefinition: (phaseId, title, explanation) => ipcRenderer.invoke('add-phase-definition', phaseId, title, explanation),
        updatePhaseDefinition: (id, title, explanation) => ipcRenderer.invoke('update-phase-definition', id, title, explanation),
        deletePhaseDefinition: (id) => ipcRenderer.invoke('delete-phase-definition', id),
        
        // Phase Tools
        getPhaseTools: (phaseId) => ipcRenderer.invoke('get-phase-tools', phaseId),
        addPhaseTool: (phaseId, name, source) => ipcRenderer.invoke('add-phase-tool', phaseId, name, source),
        updatePhaseTool: (id, name, source) => ipcRenderer.invoke('update-phase-tool', id, name, source),
        deletePhaseTool: (id) => ipcRenderer.invoke('delete-phase-tool', id),
        
        // Phase Steps
        getPhaseSteps: (phaseId) => ipcRenderer.invoke('get-phase-steps', phaseId),
        addPhaseStep: (phaseId, step, reason) => ipcRenderer.invoke('add-phase-step', phaseId, step, reason),
        updatePhaseStep: (id, step, reason) => ipcRenderer.invoke('update-phase-step', id, step, reason),
        deletePhaseStep: (id) => ipcRenderer.invoke('delete-phase-step', id),
        
        // Projects
        getProjects: () => ipcRenderer.invoke('get-projects'),
        addProject: (name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => ipcRenderer.invoke('add-project', name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status),
        updateProject: (id, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => ipcRenderer.invoke('update-project', id, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status),
        deleteProject: (id) => ipcRenderer.invoke('delete-project', id),
        
        // Reordering functions
        reorderDefinitions: (newOrder) => ipcRenderer.invoke('reorder-definitions', newOrder),
        reorderPhaseDefinitions: (phaseId, newOrder) => ipcRenderer.invoke('reorder-phase-definitions', phaseId, newOrder),
        reorderPhaseTools: (phaseId, newOrder) => ipcRenderer.invoke('reorder-phase-tools', phaseId, newOrder),
        reorderPhaseSteps: (phaseId, newOrder) => ipcRenderer.invoke('reorder-phase-steps', phaseId, newOrder),
        reorderProjects: (newOrder) => ipcRenderer.invoke('reorder-projects', newOrder),
        
        // System functions
        openExternal: (url) => ipcRenderer.invoke('open-external', url)
});