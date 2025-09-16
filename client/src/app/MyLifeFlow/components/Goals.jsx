import { useState, useEffect } from "react";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ goal: '', reason: '', duration: '' });
  const [newGoal, setNewGoal] = useState({ goal: '', reason: '', duration: '' });
  const [draggedItem, setDraggedItem] = useState(null);

  // Load data from database
  const loadGoalsData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getGoals();
      
      // Map database data to component structure
      const mappedGoals = data.map(item => ({
        id: item.id,
        goal: item.goal,
        reason: item.reason,
        duration: item.duration
      }));
      
      setGoals(mappedGoals);
    } catch (error) {
      console.error('Error loading goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoalsData();
  }, []);

  const handleEdit = (item, index) => {
    setEditingItem({ item, index });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteGoals(itemId);
      loadGoalsData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateGoals(editingItem.item.id, editingData.goal, editingData.reason, editingData.duration);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ goal: '', reason: '', duration: '' });
      loadGoalsData(); // Reload data from database
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleAddNew = async () => {
    if (newGoal.goal && newGoal.reason && newGoal.duration) {
      try {
        await window.api.addGoals(newGoal.goal, newGoal.reason, newGoal.duration);
        setNewGoal({ goal: '', reason: '', duration: '' });
        loadGoalsData(); // Reload data from database
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newGoals = [...(goals || [])];
    const draggedGoal = newGoals[draggedItem];
    
    // Remove dragged item
    newGoals.splice(draggedItem, 1);
    
    // Insert at new position
    newGoals.splice(dropIndex, 0, draggedGoal);
    
    // Update local state immediately for smooth UI
    setGoals(newGoals);
    setDraggedItem(null);

    // Save new order to database
    try {
      const newOrder = newGoals.map(goal => goal.id);
      await window.api.reorderGoals(newOrder);
    } catch (error) {
      console.error('Error reordering goals:', error);
      // Reload data to revert to original order if there was an error
      loadGoalsData();
    }
  };

  if (loading) {
    return (
      <div className="text-text">
        <h3 className="bg-surface border-b border-border p-4 py-3 text-lg font-semibold">Goals</h3>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-text-muted">Loading goals data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text">
      <h3 className="bg-surface border-b border-border p-4 py-3 text-lg font-semibold">Goals</h3>
      
      <div className="p-6">
        <div className="border border-border rounded-lg">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border">
            <div className="border-r border-border p-3 text-sm font-semibold text-text-muted">Goal</div>
            <div className="border-r border-border p-3 text-sm font-semibold text-text-muted">Reason</div>
            <div className="p-3 text-sm font-semibold text-text-muted">Duration</div>
          </div>
          
          {/* Data Rows */}
          {(goals || []).map((goal, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 border-b border-border-soft group hover:bg-elev-3 relative cursor-move transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(goal, index)}
            >
              <div className="border-r border-border-soft p-3 text-sm text-text">{goal.goal}</div>
              <div className="border-r border-border-soft p-3 text-sm text-text">{goal.reason}</div>
              <div className="p-3 text-sm text-text">
                {goal.duration}
              </div>
            </div>
          ))}
          
          {/* Add New Row */}
          <div className="grid grid-cols-3">
            <div className="border-r border-border p-3">
              <input 
                type="text" 
                value={newGoal.goal}
                onChange={(e) => setNewGoal({...newGoal, goal: e.target.value})}
                placeholder="Enter goal"
                className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="border-r border-border p-3">
              <input 
                type="text" 
                value={newGoal.reason}
                onChange={(e) => setNewGoal({...newGoal, reason: e.target.value})}
                placeholder="Enter reason"
                className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-2 flex items-center justify-between">
              <input 
                type="text" 
                value={newGoal.duration}
                onChange={(e) => setNewGoal({...newGoal, duration: e.target.value})}
                placeholder="Enter duration"
                className="flex-1 bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
              <button 
                onClick={handleAddNew}
                className="text-green-400 hover:text-green-300"
                title="Add Goal"
              >
                ➕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
          <div className="card w-96 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Goal:</label>
                <input
                  type="text"
                  value={editingData.goal}
                  onChange={(e) => setEditingData({...editingData, goal: e.target.value})}
                  className="w-full bg-surface text-text border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Reason:</label>
                <input
                  type="text"
                  value={editingData.reason}
                  onChange={(e) => setEditingData({...editingData, reason: e.target.value})}
                  className="w-full bg-surface text-text border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Duration:</label>
                <input
                  type="text"
                  value={editingData.duration}
                  onChange={(e) => setEditingData({...editingData, duration: e.target.value})}
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
                    handleDelete(editingItem.item.id);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setEditingData({ goal: '', reason: '', duration: '' });
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
