import { useState } from "react";

export default function Goals() {
  const initialGoals = [
    { goal: "Never Give Up", reason: "Bcoz giving up never be option", duration: "As long As I am on Earth" }
  ];

  const [goals, setGoals] = useState(initialGoals);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ goal: '', reason: '', duration: '' });
  const [newGoal, setNewGoal] = useState({ goal: '', reason: '', duration: '' });
  const [draggedItem, setDraggedItem] = useState(null);

  const handleEdit = (item, index) => {
    setEditingItem({ item, index });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSaveEdit = () => {
    const newData = [...goals];
    newData[editingItem.index] = { ...editingData };
    setGoals(newData);
    setShowEditModal(false);
    setEditingItem(null);
    setEditingData({ goal: '', reason: '', duration: '' });
  };

  const handleAddNew = () => {
    if (newGoal.goal && newGoal.reason && newGoal.duration) {
      setGoals([...goals, { ...newGoal }]);
      setNewGoal({ goal: '', reason: '', duration: '' });
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

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newGoals = [...goals];
    const draggedGoal = newGoals[draggedItem];
    
    // Remove dragged item
    newGoals.splice(draggedItem, 1);
    
    // Insert at new position
    newGoals.splice(dropIndex, 0, draggedGoal);
    
    setGoals(newGoals);
    setDraggedItem(null);
  };

  return (
    <div className="text-white">
      <h3 className="bg-gray-500 p-3 py-2">Goals</h3>
      
      <div className="p-6">
        <div className="border border-white rounded">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-white">
            <div className="border-r border-white p-2 text-sm font-normal">Goal</div>
            <div className="border-r border-white p-2 text-sm font-normal">Reason</div>
            <div className="p-2 text-sm font-normal">Duration</div>
          </div>
          
          {/* Data Rows */}
          {goals.map((goal, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 border-b border-white group hover:bg-gray-400 relative cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(goal, index)}
            >
              <div className="border-r border-white p-2 text-sm">{goal.goal}</div>
              <div className="border-r border-white p-2 text-sm">{goal.reason}</div>
              <div className="p-2 text-sm">
                {goal.duration}
              </div>
            </div>
          ))}
          
          {/* Add New Row */}
          <div className="grid grid-cols-3">
            <div className="border-r border-white p-2">
              <input 
                type="text" 
                value={newGoal.goal}
                onChange={(e) => setNewGoal({...newGoal, goal: e.target.value})}
                placeholder="Enter goal"
                className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
              />
            </div>
            <div className="border-r border-white p-2">
              <input 
                type="text" 
                value={newGoal.reason}
                onChange={(e) => setNewGoal({...newGoal, reason: e.target.value})}
                placeholder="Enter reason"
                className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
              />
            </div>
            <div className="p-2 flex items-center justify-between">
              <input 
                type="text" 
                value={newGoal.duration}
                onChange={(e) => setNewGoal({...newGoal, duration: e.target.value})}
                placeholder="Enter duration"
                className="flex-1 bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1 mr-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Goal:</label>
                <input
                  type="text"
                  value={editingData.goal}
                  onChange={(e) => setEditingData({...editingData, goal: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Reason:</label>
                <input
                  type="text"
                  value={editingData.reason}
                  onChange={(e) => setEditingData({...editingData, reason: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Duration:</label>
                <input
                  type="text"
                  value={editingData.duration}
                  onChange={(e) => setEditingData({...editingData, duration: e.target.value})}
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
                    handleDelete(editingItem.index);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setEditingData({ goal: '', reason: '', duration: '' });
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
