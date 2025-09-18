'use client';

import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

export default function Definition() {
  const [qaItems, setQaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ title: '', explanation: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ title: '', explanation: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
        <p className="text-[#00000080]">Loading definitions data...</p>
      </div>
    );
  }

  return (
    <div 
      className="text-text flex flex-col h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Definitions</h3>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-4 mb-6">
        {qaItems.map((item, index) => (
          <div 
            key={index}
            className="rounded-lg p-4 group hover:bg-elev-3 cursor-pointer transition-all duration-200"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDoubleClick={() => handleEdit(item, index)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-base font-semibold mb-2 text-[#000000d9]">{item.title}</h4>
                <p className="text-sm text-[#00000080]">{item.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add New Q&A Section - Show only on hover */}
      {isHovered && (
        <div className="border border-subtle rounded p-4 group">
          <div className="mb-2">
              <input 
                type="text" 
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="Title"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
              <input 
                type="text" 
                value={newItem.explanation}
                onChange={(e) => setNewItem({...newItem, explanation: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addItem();
                  }
                }}
                placeholder="Explanation (Press Enter)"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 shadow-card border border-subtle bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-4 text-[#000000d9]">Edit Definition</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Title:</label>
                <input
                  type="text"
                  value={editingData.title}
                  onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Explanation:</label>
                <textarea
                  value={editingData.explanation}
                  onChange={(e) => setEditingData({...editingData, explanation: e.target.value})}
                  rows={3}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.item.id);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ title: '', explanation: '' });
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
    </div>
  );
}
