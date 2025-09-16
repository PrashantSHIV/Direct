'use client';

import { useState } from 'react';

export default function Remember() {
  const [rememberItems, setRememberItems] = useState([
    { what: 'Never Give Up', why: 'Bcoz giving up never be option' }
  ]);
  const [newItem, setNewItem] = useState({ what: '', why: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ what: '', why: '' });
  const [draggedItem, setDraggedItem] = useState(null);

  const addItem = () => {
    if (newItem.what.trim() && newItem.why.trim()) {
      setRememberItems([...rememberItems, { 
        what: newItem.what.trim(), 
        why: newItem.why.trim() 
      }]);
      setNewItem({ what: '', why: '' });
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem({ item, index });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (index) => {
    const newItems = rememberItems.filter((_, i) => i !== index);
    setRememberItems(newItems);
  };

  const handleSaveEdit = () => {
    const newItems = [...rememberItems];
    newItems[editingItem.index] = { ...editingData };
    setRememberItems(newItems);
    setShowEditModal(false);
    setEditingItem(null);
    setEditingData({ what: '', why: '' });
  };

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
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

    const newItems = [...rememberItems];
    const draggedItemData = newItems[draggedItem];
    
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);
    
    setRememberItems(newItems);
    setDraggedItem(null);
  };

  return (
    <div className="text-text">
      <h3 className="bg-surface border-b border-border p-4 py-3 text-lg font-semibold">Remember</h3>
      
      <div className="p-6">
        <div className="border border-border rounded-lg">
          <div className="grid grid-cols-2 border-b border-border">
            <div className="border-r border-border p-3 text-sm font-semibold text-text-muted">What</div>
            <div className="p-3 text-sm font-semibold text-text-muted">Why</div>
          </div>
          
          {/* Remember Items Rows */}
          {rememberItems.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-border-soft group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(item, index)}
            >
              <div className="border-r border-border-soft p-3 text-sm text-text">{item.what}</div>
              <div className="p-3 text-sm text-text">{item.why}</div>
            </div>
          ))}
          
          {/* Add New Item Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-border p-3">
              <input 
                type="text" 
                value={newItem.what}
                onChange={(e) => setNewItem({...newItem, what: e.target.value})}
                placeholder="What to remember"
                className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-2 flex items-center justify-between">
              <input 
                type="text" 
                value={newItem.why}
                onChange={(e) => setNewItem({...newItem, why: e.target.value})}
                placeholder="Why to remember"
                className="flex-1 bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
              />
              <button 
                onClick={addItem}
                className="text-green-400 hover:text-green-300 ml-2"
                title="Add Item"
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
            <h3 className="text-lg font-semibold mb-4">Edit Remember Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">What:</label>
                <input
                  type="text"
                  value={editingData.what}
                  onChange={(e) => setEditingData({...editingData, what: e.target.value})}
                  className="w-full bg-surface text-text border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Why:</label>
                <input
                  type="text"
                  value={editingData.why}
                  onChange={(e) => setEditingData({...editingData, why: e.target.value})}
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
                    handleDelete(editingItem.index);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setEditingData({ what: '', why: '' });
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
