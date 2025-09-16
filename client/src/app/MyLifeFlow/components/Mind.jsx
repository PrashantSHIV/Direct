'use client';

import { useState } from 'react';

export default function Mind() {
  const [activeSection, setActiveSection] = useState('Breathing');
  const [sections, setSections] = useState([
    { id: 'Breathing', name: 'Breathing' },
    { id: 'Yogasana', name: 'Yogasana' },
  ]);
  const [mindItems, setMindItems] = useState({
    'Breathing': [
      { name: 'Anulom-Vilom', technique: ['Sit in any position', 'Use your right arm', 'Close right nostril with thumb', 'Breathe through left nostril'] }
    ],
    'Yogasana': [],
  });
  const [newSectionName, setNewSectionName] = useState('');
  const [newItem, setNewItem] = useState({ name: '', technique: [''] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', technique: [''] });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);

  const addSection = () => {
    if (newSectionName.trim()) {
      const newId = newSectionName.trim();
      setSections([...sections, { id: newId, name: newSectionName.trim() }]);
      setMindItems({...mindItems, [newId]: []});
      setNewSectionName('');
    }
  };

  const addItem = () => {
    if (newItem.name.trim() && newItem.technique[0].trim()) {
      const filteredTechnique = newItem.technique.filter(step => step.trim());
      setMindItems({
        ...mindItems,
        [activeSection]: [...mindItems[activeSection], { 
          name: newItem.name.trim(), 
          technique: filteredTechnique 
        }]
      });
      setNewItem({ name: '', technique: [''] });
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem({ item, index, section: activeSection });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (index) => {
    const newItems = mindItems[activeSection].filter((_, i) => i !== index);
    setMindItems({...mindItems, [activeSection]: newItems});
  };

  const handleSaveEdit = () => {
    const newItems = [...mindItems[editingItem.section]];
    newItems[editingItem.index] = { ...editingData };
    setMindItems({...mindItems, [editingItem.section]: newItems});
    setShowEditModal(false);
    setEditingItem(null);
    setEditingData({ name: '', technique: [''] });
  };

  const addTechniqueStep = () => {
    setEditingData({...editingData, technique: [...editingData.technique, '']});
  };

  const updateTechniqueStep = (index, value) => {
    const newTechnique = [...editingData.technique];
    newTechnique[index] = value;
    setEditingData({...editingData, technique: newTechnique});
  };

  const removeTechniqueStep = (index) => {
    const newTechnique = editingData.technique.filter((_, i) => i !== index);
    setEditingData({...editingData, technique: newTechnique});
  };

  // Item drag and drop functions
  const handleItemDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleItemDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleItemDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleItemDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newItems = [...mindItems[activeSection]];
    const draggedItemData = newItems[draggedItem];
    
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);
    
    setMindItems({...mindItems, [activeSection]: newItems});
    setDraggedItem(null);
  };

  // Section drag and drop functions
  const handleSectionDragStart = (e, index) => {
    setDraggedSection(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleSectionDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedSection(null);
  };

  const handleSectionDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSectionDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSection === null || draggedSection === dropIndex) return;

    const newSections = [...sections];
    const draggedSectionData = newSections[draggedSection];
    
    newSections.splice(draggedSection, 1);
    newSections.splice(dropIndex, 0, draggedSectionData);
    
    setSections(newSections);
    setDraggedSection(null);
  };

  return (
    <div className="text-white flex flex-col h-full">
      <h3 className="bg-gray-500 p-3 py-2">Mind</h3>
      
      <div className="grid grid-cols-[240px_1fr] gap-6 flex-1">
        {/* Left Panel - Sections */}
        <aside className="bg-gray-500 p-4">
          <nav className="space-y-2 mb-4">
            {sections.map((section, index) => (
              <button
                key={section.id}
                draggable
                onDragStart={(e) => handleSectionDragStart(e, index)}
                onDragEnd={handleSectionDragEnd}
                onDragOver={handleSectionDragOver}
                onDrop={(e) => handleSectionDrop(e, index)}
                onClick={() => setActiveSection(section.id)}
                className={`block w-full text-left text-white text-sm font-normal px-3 py-2 rounded hover:bg-gray-600 cursor-move ${
                  activeSection === section.id ? 'border border-white bg-gray-600' : ''
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add new section" 
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="flex-1 border border-white bg-transparent text-white px-2 py-1 text-sm rounded"
            />
            <button 
              onClick={addSection}
              className="border border-white px-2 py-1 rounded text-sm hover:bg-gray-600"
            >
              +
            </button>
          </div>
        </aside>

        {/* Right Panel - Content */}
        <section className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-normal">{activeSection}</h4>
          </div>
          
          <div className="border border-white rounded">
            <div className="grid grid-cols-2 border-b border-white">
              <div className="border-r border-white p-2 text-sm font-normal">Name</div>
              <div className="p-2 text-sm font-normal">Technique</div>
            </div>
            
            {/* Mind Items Rows */}
            {mindItems[activeSection].map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-2 border-b border-white group hover:bg-gray-400 cursor-pointer"
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragEnd={handleItemDragEnd}
                onDragOver={handleItemDragOver}
                onDrop={(e) => handleItemDrop(e, index)}
                onDoubleClick={() => handleEdit(item, index)}
              >
                <div className="border-r border-white p-2 text-sm">{item.name}</div>
                <div className="p-2 text-sm">
                  <ol className="list-decimal list-inside space-y-1">
                    {item.technique.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
            
            {/* Add New Item Row */}
            <div className="grid grid-cols-2">
              <div className="border-r border-white p-2">
                <input 
                  type="text" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Item name"
                  className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
                />
              </div>
              <div className="p-2 flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  {newItem.technique.map((step, index) => (
                    <input 
                      key={index}
                      type="text" 
                      value={step}
                      onChange={(e) => {
                        const newTechnique = [...newItem.technique];
                        newTechnique[index] = e.target.value;
                        setNewItem({...newItem, technique: newTechnique});
                      }}
                      placeholder={`Step ${index + 1}`}
                      className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
                    />
                  ))}
                  <button 
                    onClick={() => setNewItem({...newItem, technique: [...newItem.technique, '']})}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    + Add Step
                  </button>
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
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Mind Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Technique Steps:</label>
                <div className="space-y-2">
                  {editingData.technique.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateTechniqueStep(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1 bg-transparent text-white border border-white/50 rounded px-3 py-2"
                      />
                      <button
                        onClick={() => removeTechniqueStep(index)}
                        className="text-red-400 hover:text-red-300 px-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTechniqueStep}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    + Add Step
                  </button>
                </div>
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
                    setEditingData({ name: '', technique: [''] });
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
