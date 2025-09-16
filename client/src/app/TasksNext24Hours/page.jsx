'use client';

import { useState } from 'react';

export default function TasksNext24Hours() {
  const [activeTasks, setActiveTasks] = useState([
    { task: 'Complete project proposal', createdAt: new Date() },
    { task: 'Review team feedback', createdAt: new Date() },
    { task: 'Prepare presentation', createdAt: new Date() }
  ]);
  const [completedTasks, setCompletedTasks] = useState([
    { task: 'Send email to client', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'completed' },
    { task: 'Update documentation', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), status: 'completed' },
    { task: 'Fix bug in login', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), status: 'failed' }
  ]);
  const [newTask, setNewTask] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingData, setEditingData] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('completed');

  const addTask = () => {
    if (newTask.trim()) {
      setActiveTasks([...activeTasks, { 
        task: newTask.trim(), 
        createdAt: new Date() 
      }]);
      setNewTask('');
    }
  };

  const handleEdit = (task, index) => {
    setEditingTask({ task, index });
    setEditingData(task.task);
    setShowEditModal(true);
  };

  const handleDelete = (index) => {
    const newTasks = activeTasks.filter((_, i) => i !== index);
    setActiveTasks(newTasks);
  };

  const handleSaveEdit = () => {
    const newTasks = [...activeTasks];
    newTasks[editingTask.index] = { ...newTasks[editingTask.index], task: editingData };
    setActiveTasks(newTasks);
    setShowEditModal(false);
    setEditingTask(null);
    setEditingData('');
  };

  const markAsCompleted = (index) => {
    const task = activeTasks[index];
    const newCompletedTask = { ...task, status: 'completed' };
    setCompletedTasks([newCompletedTask, ...completedTasks]);
    handleDelete(index);
  };

  const markAsFailed = (index) => {
    const task = activeTasks[index];
    const newFailedTask = { ...task, status: 'failed' };
    setCompletedTasks([newFailedTask, ...completedTasks]);
    handleDelete(index);
  };

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedTask(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedTask === null || draggedTask === dropIndex) return;

    const newTasks = [...activeTasks];
    const draggedTaskData = newTasks[draggedTask];
    
    newTasks.splice(draggedTask, 1);
    newTasks.splice(dropIndex, 0, draggedTaskData);
    
    setActiveTasks(newTasks);
    setDraggedTask(null);
  };

  const getFilteredTasks = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return completedTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= twentyFourHoursAgo && task.status === statusFilter;
    });
  };

  return (
    <div className="text-text">
      <h3 className="bg-surface border-b border-border p-4 py-3 text-lg font-semibold">Tasks Next 24 Hours</h3>
      
      <div className="p-6">
        {/* Two Panel Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Tasks Next 24 Hours */}
          <div>
            {/* Task Input Area */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter new task"
                  className="flex-1 border border-border bg-surface text-text px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button 
                  onClick={addTask}
                  className="btn px-4 py-3 rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {activeTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="card group hover:bg-elev-3 cursor-pointer transition-all duration-200 hover:shadow-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDoubleClick={() => handleEdit(task, index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{task.task}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsCompleted(index);
                        }}
                        className="text-success hover:text-success/80 text-xs px-3 py-1 border border-success rounded-lg hover:bg-success/10 transition-all duration-200"
                        title="Mark as Completed"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsFailed(index);
                        }}
                        className="text-danger hover:text-danger/80 text-xs px-3 py-1 border border-danger rounded-lg hover:bg-danger/10 transition-all duration-200"
                        title="Mark as Failed"
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Tasks (Completed/Failed) */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-text">Tasks</h4>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'completed' 
                    ? 'bg-success text-text-inverse shadow-card' 
                    : 'border border-border text-text-muted hover:bg-elev-3 hover:text-accent-green'
                }`}
              >
                Completed
              </button>
              <button 
                onClick={() => setStatusFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'failed' 
                    ? 'bg-danger text-text-inverse shadow-card' 
                    : 'border border-border text-text-muted hover:bg-elev-3 hover:text-accent-pink'
                }`}
              >
                Failed
              </button>
            </div>
            
            <div className="space-y-3">
              {getFilteredTasks().map((task, index) => (
                <div 
                  key={index} 
                  className="card"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{task.task}</span>
                    <span className={`text-xs px-3 py-1 rounded-lg font-medium ${
                      task.status === 'completed' 
                        ? 'bg-success text-text-inverse' 
                        : 'bg-danger text-text-inverse'
                    }`}>
                      {task.status === 'completed' ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-2">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
          <div className="card w-96 max-w-[90vw] shadow-card">
            <h3 className="text-lg font-semibold mb-4 text-text">Edit Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-text-muted">Task:</label>
                <input
                  type="text"
                  value={editingData}
                  onChange={(e) => setEditingData(e.target.value)}
                  className="w-full bg-surface text-text border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-elev-3 text-text rounded-lg hover:bg-elev-2 transition-all duration-200"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleDelete(editingTask.index);
                    setShowEditModal(false);
                    setEditingTask(null);
                    setEditingData('');
                  }}
                  className="px-4 py-2 bg-danger text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
