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
    <div className="text-white">
      <h3 className="bg-gray-500 p-3 py-2">Remember</h3>
      
      <div className="p-6">
        <div className="border border-white rounded">
          <div className="grid grid-cols-2 border-b border-white">
            <div className="border-r border-white p-2 text-sm font-normal">What</div>
            <div className="p-2 text-sm font-normal">Why</div>
          </div>
          
          {/* Remember Items Rows */}
          {rememberItems.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-white group hover:bg-gray-400 cursor-pointer"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(item, index)}
            >
              <div className="border-r border-white p-2 text-sm">{item.what}</div>
              <div className="p-2 text-sm">{item.why}</div>
            </div>
          ))}
          
          {/* Add New Item Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-white p-2">
              <input 
                type="text" 
                value={newItem.what}
                onChange={(e) => setNewItem({...newItem, what: e.target.value})}
                placeholder="What to remember"
                className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Remember Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">What:</label>
                <input
                  type="text"
                  value={editingData.what}
                  onChange={(e) => setEditingData({...editingData, what: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Why:</label>
                <input
                  type="text"
                  value={editingData.why}
                  onChange={(e) => setEditingData({...editingData, why: e.target.value})}
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
                    setEditingData({ what: '', why: '' });
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
