'use client';

import { useState, useEffect } from 'react';

export default function TasksNext24Hours() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingData, setEditingData] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('completed');

  // Load data from database
  const loadTasksData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getTask();
      console.log('Tasks data loaded:', data);
      
      // Separate active and completed tasks
      const active = [];
      const completed = [];
      
      data.forEach(item => {
        const taskData = {
          id: item.id,
          task: item.task,
          createdAt: new Date(item.created_at || Date.now()),
          status: item.status || 'active'
        };
        
        if (item.status === 'completed' || item.status === 'failed') {
          completed.push(taskData);
        } else {
          active.push(taskData);
        }
      });
      
      // Sort tasks with newest first
      active.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error loading tasks data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasksData();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        await window.api.addTask(newTask.trim());
        setNewTask('');
        loadTasksData(); // Reload data from database
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleEdit = (task, index) => {
    setEditingTask({ task, index });
    setEditingData(task.task);
    setShowEditModal(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await window.api.deleteTask(taskId);
      loadTasksData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateTask(editingTask.task.id, editingData);
      setShowEditModal(false);
      setEditingTask(null);
      setEditingData('');
      loadTasksData(); // Reload data from database
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      const task = activeTasks.find(t => t.id === taskId);
      if (task) {
        await window.api.updateTask(taskId, task.task, 'completed');
        loadTasksData(); // Reload data from database
      }
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
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

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedTask === null || draggedTask === dropIndex) return;

    const newTasks = [...(activeTasks || [])];
    const draggedTaskData = newTasks[draggedTask];
    
    newTasks.splice(draggedTask, 1);
    newTasks.splice(dropIndex, 0, draggedTaskData);
    
    // Update local state immediately for smooth UI
    setActiveTasks(newTasks);
    setDraggedTask(null);

    // Save new order to database
    try {
      const newOrder = newTasks.map(task => task.id);
      await window.api.reorderTasks(newOrder);
      console.log('Tasks reordered successfully');
    } catch (error) {
      console.error('Error reordering tasks:', error);
      // Reload data to revert to original order if there was an error
      loadTasksData();
    }
  };

  const getFilteredTasks = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return completedTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= twentyFourHoursAgo && task.status === statusFilter;
    });
  };

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Tasks Next 24 Hours</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#00000080]">Loading tasks data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Tasks Next 24 Hours</h3>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Two Panel Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Current Tasks */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-[#000000d9]">Current Tasks</h4>
            {/* Task Input Area */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter new task (Presss Enter)"
                  className="flex-1 border border-subtle bg-surface text-[#000000d9] px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
              </div>
            </div>
            <div className="space-y-2">
              {activeTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-subtle rounded-lg p-3 group hover:bg-elev-3 cursor-pointer transition-all duration-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDoubleClick={() => handleEdit(task, index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#000000d9]">{task.task}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsCompleted(task.id);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-xs px-3 py-1 border border-subtle rounded-lg hover:bg-elev-3 transition-all duration-200"
                        title="Mark as Completed"
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Task History */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-[#000000d9]">Task History</h4>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setStatusFilter('completed')}
                className={`nav-button ${statusFilter === 'completed' ? 'active' : ''}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setStatusFilter('failed')}
                className={`nav-button ${statusFilter === 'failed' ? 'active' : ''}`}
              >
                Failed
              </button>
            </div>
            
            <div className="space-y-2">
              {getFilteredTasks().map((task, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-subtle rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#000000d9]">{task.task}</span>
                  </div>
                  <div className="text-xs text-[#00000080] mt-2">
                    {(() => {
                      const utcDate = new Date(task.createdAt);
                      const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
                      return istDate.toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 max-w-[90vw] shadow-card border border-subtle bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#000000d9]">Edit Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#00000080]">Task:</label>
                <input
                  type="text"
                  value={editingData}
                  onChange={(e) => setEditingData(e.target.value)}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingTask.task.id);
                  setShowEditModal(false);
                  setEditingTask(null);
                  setEditingData('');
                }}
                className="px-4 py-2 bg-danger text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-elev-3 text-[#000000d9] rounded-lg hover:bg-elev-2 transition-all duration-200"
                >
                  Cancel
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
