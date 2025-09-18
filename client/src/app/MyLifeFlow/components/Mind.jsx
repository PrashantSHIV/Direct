'use client';

import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

export default function Mind() {
  const [activeSection, setActiveSection] = useState('');
  const [sections, setSections] = useState([]);
  const [mindItems, setMindItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [newSectionName, setNewSectionName] = useState('');
  const [newItem, setNewItem] = useState({ name: '', technique: [''] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', technique: [''] });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);

  // Load data from database
  const loadMindData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getMind();
      
      // Group data by section and extract unique section names
      const groupedData = {};
      const uniqueSections = new Set();
      
      data.forEach(item => {
        if (!groupedData[item.section_name]) {
          groupedData[item.section_name] = [];
        }
        groupedData[item.section_name].push({
          id: item.id,
          name: item.technique_name,
          technique: item.technique_steps
        });
        uniqueSections.add(item.section_name);
      });
      
      // Convert Set to array and create section objects
      const sectionsArray = Array.from(uniqueSections).map(sectionName => ({
        id: sectionName,
        name: sectionName
      }));
      
      setSections(sectionsArray);
      setMindItems(groupedData);
      
      // Set active section to first section if none is selected
      if (!activeSection && sectionsArray.length > 0) {
        setActiveSection(sectionsArray[0].id);
      }
    } catch (error) {
      console.error('Error loading mind data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMindData();
  }, []);

  const addSection = async () => {
    if (newSectionName.trim()) {
      try {
        const newSectionId = newSectionName.trim();
        // Add a sample item to create the section
        await window.api.addMind(newSectionId, 'Sample Technique', ['Add your technique steps here']);
        setNewSectionName('');
        loadMindData(); // Reload data to update sections
        setActiveSection(newSectionId); // Set the new section as active
      } catch (error) {
        console.error('Error adding section:', error);
      }
    }
  };

  const addItem = async () => {
    if (newItem.name.trim() && newItem.technique[0].trim()) {
      try {
        const filteredTechnique = newItem.technique.filter(step => step.trim());
        await window.api.addMind(activeSection, newItem.name.trim(), filteredTechnique);
        setNewItem({ name: '', technique: [''] });
        loadMindData(); // Reload data from database
      } catch (error) {
        console.error('Error adding mind item:', error);
      }
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem({ item, index, section: activeSection });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteMind(itemId);
      loadMindData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting mind item:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateMind(editingItem.item.id, activeSection, editingData.name, editingData.technique);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ name: '', technique: [''] });
      loadMindData(); // Reload data from database
    } catch (error) {
      console.error('Error updating mind item:', error);
    }
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

  const handleItemDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newItems = [...mindItems[activeSection]];
    const draggedItemData = newItems[draggedItem];
    
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);
    
    // Update local state immediately for smooth UI
    setMindItems({...mindItems, [activeSection]: newItems});
    setDraggedItem(null);

    // Save new order to database
    try {
      const newOrder = newItems.map(item => item.id);
      await window.api.reorderMindItems(activeSection, newOrder);
    } catch (error) {
      console.error('Error reordering items:', error);
      // Reload data to revert to original order if there was an error
      loadMindData();
    }
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

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Mind</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#00000080]">Loading mind data...</p>
        </div>
      </div>
    );
  }

  // Show message if no sections exist
  if (sections.length === 0) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Mind</h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#00000080] mb-4">No mind sections found. Create your first section!</p>
            <div className="flex gap-2 justify-center">
              <input 
                type="text" 
                placeholder="Section name (e.g., Breathing, Meditation) - Press Enter" 
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSection();
                  }
                }}
                className="border border-subtle bg-surface text-[#000000d9] px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Mind</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3 md:gap-6 flex-1">
        {/* Left Panel - Sections */}
        <aside className="bg-elev-2 lg:border-r border-b lg:border-b-0 border-subtle p-3 md:p-4">
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
                className={`block w-full text-left text-sm font-medium px-3 py-2 rounded-lg border border-transparent cursor-move transition-colors duration-200 ${
                  activeSection === section.id ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
          <input 
            type="text" 
            placeholder="Add new section" 
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addSection();
              }
            }}
            className="w-full border border-subtle bg-surface text-[#000000d9] px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
          />
        </aside>

        {/* Right Panel - Content */}
        <section className="p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-normal">{activeSection}</h4>
          </div>
          
          <div className="border border-subtle rounded-lg overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-2 border-b border-subtle">
                <div className="border-r border-subtle p-2 md:p-3 text-xs md:text-sm font-semibold text-[#00000080]">Name</div>
                <div className="p-2 md:p-3 text-xs md:text-sm font-semibold text-[#00000080]">Technique</div>
              </div>
            
            {/* Mind Items Rows */}
            {(mindItems[activeSection] || []).map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-2 border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200"
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragEnd={handleItemDragEnd}
                onDragOver={handleItemDragOver}
                onDrop={(e) => handleItemDrop(e, index)}
                onDoubleClick={() => handleEdit(item, index)}
              >
                <div className="border-r border-subtle p-2 md:p-3 text-xs md:text-sm text-[#000000d9]">{item.name}</div>
                <div className="p-2 md:p-3 text-xs md:text-sm text-[#000000d9]">
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
              <div className="border-r border-subtle p-2 md:p-3">
                <input 
                  type="text" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Item name"
                  className="w-full bg-surface text-[#000000d9] text-xs md:text-sm border border-subtle rounded-lg px-2 md:px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              <div className="p-2 md:p-3 flex flex-col">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setNewItem({...newItem, technique: [...newItem.technique, '']});
                        }
                      }}
                      placeholder={`Step ${index + 1} (Press Enter to add step)`}
                      className="w-full bg-surface text-[#000000d9] text-xs md:text-sm border border-subtle rounded-lg px-2 md:px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={addItem}
                    className="text-success hover:text-success/80 transition-colors duration-200"
                    title="Add Item"
                  >
                    <IoMdAdd className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-80 md:w-96 max-w-[90vw] shadow-card border border-subtle bg-white rounded-lg p-4 md:p-6 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-[#000000d9]">Edit Mind Item</h3>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Name:</label>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-2 md:px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Technique Steps:</label>
                <div className="space-y-2">
                  {editingData.technique.map((step, index) => (
                    <div key={index} className="flex gap-1 md:gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateTechniqueStep(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addTechniqueStep();
                          }
                        }}
                        className="flex-1 bg-surface text-[#000000d9] border border-subtle rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      />
                      <button
                        onClick={() => removeTechniqueStep(index)}
                        className="text-danger hover:text-danger/80 transition-colors duration-200 px-1 md:px-2"
                      >
                        <MdOutlineDelete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTechniqueStep}
                    className="text-success hover:text-success/80 transition-colors duration-200"
                  >
                    <IoMdAdd className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 md:mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.item.id);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ name: '', technique: [''] });
                }}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-danger text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Delete
              </button>
              <div className="flex gap-1 md:gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-elev-3 text-[#000000d9] rounded-lg hover:bg-elev-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
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
