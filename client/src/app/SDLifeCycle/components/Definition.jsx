'use client';

import { useState, useEffect } from 'react';

export default function Definition() {
  const [qaItems, setQaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ title: '', explanation: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ title: '', explanation: '' });
  const [draggedItem, setDraggedItem] = useState(null);

  // Load data from database
  const loadDefinitionsData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getDefinitions();
      console.log('Definitions data loaded:', data);
      
      // Map data to component structure
      const mappedData = data.map(item => ({
        id: item.id,
        title: item.title,
        explanation: item.explanation
      }));
      
      setQaItems(mappedData);
    } catch (error) {
      console.error('Error loading definitions data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefinitionsData();
  }, []);

  const addItem = async () => {
    if (newItem.title.trim() && newItem.explanation.trim()) {
      try {
        await window.api.addDefinition(newItem.title.trim(), newItem.explanation.trim());
        setNewItem({ title: '', explanation: '' });
        loadDefinitionsData(); // Reload data from database
      } catch (error) {
        console.error('Error adding definition:', error);
      }
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem({ item, index });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteDefinition(itemId);
      loadDefinitionsData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting definition:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateDefinition(editingItem.item.id, editingData.title, editingData.explanation);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ title: '', explanation: '' });
      loadDefinitionsData(); // Reload data from database
    } catch (error) {
      console.error('Error updating definition:', error);
    }
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

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newItems = [...qaItems];
    const draggedItemData = newItems[draggedItem];
    
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);
    
    setQaItems(newItems);
    setDraggedItem(null);

    // Save new order to database
    try {
      await window.api.reorderDefinitions(newItems);
    } catch (error) {
      console.error('Error reordering definitions:', error);
      // Reload data from database to revert changes
      loadDefinitionsData();
    }
  };
  if (loading) {
    return (
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading definitions data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {qaItems.map((item, index) => (
          <div 
            key={index}
            className="card group hover:bg-elev-3 cursor-pointer transition-all duration-200 hover:shadow-card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDoubleClick={() => handleEdit(item, index)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-base font-semibold mb-2 text-text">{item.title}</h4>
                <p className="text-sm text-text-muted">{item.explanation}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-2 ml-2 transition-opacity duration-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-danger hover:text-danger/80 text-xs px-3 py-1 border border-danger rounded-lg hover:bg-danger/10 transition-all duration-200"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add New Q&A Section */}
      <div className="border border-white rounded p-4 group">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <input 
              type="text" 
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              placeholder="Title"
              className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1 mb-2"
            />
            <input 
              type="text" 
              value={newItem.explanation}
              onChange={(e) => setNewItem({...newItem, explanation: e.target.value})}
              placeholder="Explanation"
              className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
            />
          </div>
          <button 
            onClick={addItem}
            className="text-green-400 hover:text-green-300 ml-2"
            title="Add Item"
          >
            ➕
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Definition</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title:</label>
                <input
                  type="text"
                  value={editingData.title}
                  onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Explanation:</label>
                <textarea
                  value={editingData.explanation}
                  onChange={(e) => setEditingData({...editingData, explanation: e.target.value})}
                  rows={3}
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
                    handleDelete(editingItem.item.id);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setEditingData({ title: '', explanation: '' });
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
