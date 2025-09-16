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
    <div className="text-white">
      <h3 className="bg-gray-500 p-3 py-2">Tasks Next 24 Hours</h3>
      
      <div className="p-6">
        {/* Two Panel Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Tasks Next 24 Hours */}
          <div>
            {/* Task Input Area */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter new task"
                  className="flex-1 border border-white bg-transparent text-white px-3 py-2 rounded"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button 
                  onClick={addTask}
                  className="border border-white px-3 py-2 rounded hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {activeTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="border border-white rounded p-3 group hover:bg-gray-400 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDoubleClick={() => handleEdit(task, index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{task.task}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsCompleted(index);
                        }}
                        className="text-green-400 hover:text-green-300 text-xs px-2 py-1 border border-green-400 rounded"
                        title="Mark as Completed"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsFailed(index);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 rounded"
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
            <h4 className="text-base font-normal mb-4">Tasks</h4>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded text-sm border ${
                  statusFilter === 'completed' 
                    ? 'border-white bg-gray-600' 
                    : 'border-white/50 hover:bg-gray-600'
                }`}
              >
                Completed
              </button>
              <button 
                onClick={() => setStatusFilter('failed')}
                className={`px-3 py-1 rounded text-sm border ${
                  statusFilter === 'failed' 
                    ? 'border-white bg-gray-600' 
                    : 'border-white/50 hover:bg-gray-600'
                }`}
              >
                Failed
              </button>
            </div>
            
            <div className="space-y-2">
              {getFilteredTasks().map((task, index) => (
                <div 
                  key={index} 
                  className="border border-white rounded p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{task.task}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {task.status === 'completed' ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Task:</label>
                <input
                  type="text"
                  value={editingData}
                  onChange={(e) => setEditingData(e.target.value)}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
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
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
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
