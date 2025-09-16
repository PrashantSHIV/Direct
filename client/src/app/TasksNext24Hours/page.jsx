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

  const markAsFailed = async (taskId) => {
    try {
      const task = activeTasks.find(t => t.id === taskId);
      if (task) {
        await window.api.updateTask(taskId, task.task, 'failed');
        loadTasksData(); // Reload data from database
      }
    } catch (error) {
      console.error('Error marking task as failed:', error);
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
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading tasks data...</p>
      </div>
    );
  }

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
                          markAsCompleted(task.id);
                        }}
                        className="text-success hover:text-success/80 text-xs px-3 py-1 border border-success rounded-lg hover:bg-success/10 transition-all duration-200"
                        title="Mark as Completed"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsFailed(task.id);
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
                    handleDelete(editingTask.task.id);
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
