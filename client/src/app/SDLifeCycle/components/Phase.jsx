'use client';

import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

export default function Phase({ activePhase }) {
  const [phaseData, setPhaseData] = useState({
    definitions: [],
    tools: [],
    steps: []
  });
  const [loading, setLoading] = useState(true);
  const [phaseId, setPhaseId] = useState(null);

  const [newStep, setNewStep] = useState({ step: '', reason: '' });
  const [newDefinition, setNewDefinition] = useState({ title: '', explanation: '' });
  const [newTool, setNewTool] = useState({ name: '', src: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedType, setDraggedType] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);

  // Load phase data from database
  const loadPhaseData = async () => {
    try {
      setLoading(true);
      
      // First, get or create the phase
      const phases = await window.api.getPhases();
      let currentPhase = phases.find(p => p.name === activePhase);
      
      if (!currentPhase) {
        // Create the phase if it doesn't exist
        await window.api.addPhase(activePhase);
        const updatedPhases = await window.api.getPhases();
        currentPhase = updatedPhases.find(p => p.name === activePhase);
      }
      
      setPhaseId(currentPhase.id);
      
      // Load all phase-specific data
      const [definitions, tools, steps] = await Promise.all([
        window.api.getPhaseDefinitions(currentPhase.id),
        window.api.getPhaseTools(currentPhase.id),
        window.api.getPhaseSteps(currentPhase.id)
      ]);
      
      setPhaseData({
        definitions: definitions.map(item => ({
          id: item.id,
          title: item.title,
          explanation: item.explanation
        })),
        tools: tools.map(item => ({
          id: item.id,
          name: item.name,
          src: item.source
        })),
        steps: steps.map(item => ({
          id: item.id,
          step: item.step,
          reason: item.reason
        }))
      });
    } catch (error) {
      console.error('Error loading phase data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePhase) {
      loadPhaseData();
    }
  }, [activePhase]);

  const addStep = async () => {
    if (newStep.step.trim() && newStep.reason.trim() && phaseId) {
      try {
        await window.api.addPhaseStep(phaseId, newStep.step.trim(), newStep.reason.trim());
        setNewStep({ step: '', reason: '' });
        loadPhaseData(); // Reload data from database
        
        // Focus on the step input after adding
        setTimeout(() => {
          const stepInput = document.querySelector('input[placeholder="Step"]');
          if (stepInput) stepInput.focus();
        }, 100);
      } catch (error) {
        console.error('Error adding phase step:', error);
      }
    }
  };

  const addDefinition = async () => {
    if (newDefinition.title.trim() && newDefinition.explanation.trim() && phaseId) {
      try {
        await window.api.addPhaseDefinition(phaseId, newDefinition.title.trim(), newDefinition.explanation.trim());
        setNewDefinition({ title: '', explanation: '' });
        loadPhaseData(); // Reload data from database
        
        // Focus on the title input after adding
        setTimeout(() => {
          const titleInput = document.querySelector('input[placeholder="Question/Title"]');
          if (titleInput) titleInput.focus();
        }, 100);
      } catch (error) {
        console.error('Error adding phase definition:', error);
      }
    }
  };

  const addTool = async () => {
    if (newTool.name.trim() && newTool.src.trim() && phaseId) {
      try {
        await window.api.addPhaseTool(phaseId, newTool.name.trim(), newTool.src.trim());
        setNewTool({ name: '', src: '' });
        loadPhaseData(); // Reload data from database
        
        // Focus on the name input after adding
        setTimeout(() => {
          const nameInput = document.querySelector('input[placeholder="Name"]');
          if (nameInput) nameInput.focus();
        }, 100);
      } catch (error) {
        console.error('Error adding phase tool:', error);
      }
    }
  };

  const deleteItem = async (type, itemId) => {
    try {
      if (type === 'definitions') {
        await window.api.deletePhaseDefinition(itemId);
      } else if (type === 'tools') {
        await window.api.deletePhaseTool(itemId);
      } else if (type === 'steps') {
        await window.api.deletePhaseStep(itemId);
      }
      loadPhaseData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting phase item:', error);
    }
  };

  // Drag and drop functions
  const handleDragStart = (e, index, type) => {
    setDraggedItem(index);
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDraggedType(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex, type) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex || draggedType !== type) return;

    const items = [...phaseData[type]];
    const draggedItemData = items[draggedItem];
    
    items.splice(draggedItem, 1);
    items.splice(dropIndex, 0, draggedItemData);
    
    setPhaseData(prev => ({
      ...prev,
      [type]: items
    }));
    setDraggedItem(null);
    setDraggedType(null);

    // Save new order to database
    try {
      if (type === 'definitions') {
        await window.api.reorderPhaseDefinitions(phaseId, items);
      } else if (type === 'tools') {
        await window.api.reorderPhaseTools(phaseId, items);
      } else if (type === 'steps') {
        await window.api.reorderPhaseSteps(phaseId, items);
      }
    } catch (error) {
      console.error('Error reordering phase items:', error);
      // Reload data from database to revert changes
      loadPhaseData();
    }
  };

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 text-[#000000d9] font-semibold text-sm md:text-base">{activePhase} Phase</h3>
        <div className="flex-1 flex items-center justify-center p-3 md:p-6">
          <p className="text-[#00000080]">Loading phase data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 text-[#000000d9] font-semibold text-sm md:text-base">{activePhase} Phase</h3>
      
      <div className="p-3 md:p-6 flex-1 overflow-y-auto">
        {/* Top Row - Definitions and Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 md:gap-6 mb-6">
          {/* Left Section - Definitions */}
          <div>
            <h4 className="text-base font-normal mb-4">Definitions</h4>
            {/* Definitions Section */}
            <div 
              className="border border-subtle rounded-lg p-3 md:p-4"
              onMouseEnter={() => setHoveredSection('definitions')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="space-y-4 mb-4">
                {(phaseData.definitions || []).map((def, index) => (
                  <div 
                    key={index}
                    className="rounded-lg p-4 group hover:bg-elev-3 cursor-pointer transition-all duration-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'definitions')}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'definitions')}
                    onDoubleClick={() => {/* Handle edit if needed */}}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold mb-2 text-[#000000d9]">{def.title}</h5>
                        <p className="text-xs text-[#00000080]">{def.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Definition - Show only when hovering definitions section */}
              {hoveredSection === 'definitions' && (
                <div className="border border-subtle rounded-lg p-4">
                  <div className="mb-2">
                    <input 
                      type="text" 
                      value={newDefinition.title}
                      onChange={(e) => setNewDefinition({...newDefinition, title: e.target.value})}
                      placeholder="Question/Title"
                      className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    />
                    <input 
                      type="text" 
                      value={newDefinition.explanation}
                      onChange={(e) => setNewDefinition({...newDefinition, explanation: e.target.value})}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addDefinition();
                        }
                      }}
                      placeholder="Answer/Explanation (Press Enter)"
                      className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Tools */}
          <div>
            <h4 className="text-base font-normal mb-4">Tools</h4>
            <div 
              className="border border-subtle rounded-lg p-3 md:p-4"
              onMouseEnter={() => setHoveredSection('tools')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="space-y-2">
                {(phaseData.tools || []).map((tool, index) => (
                  <div 
                    key={index}
                    className="border border-subtle rounded-lg p-3 group hover:bg-elev-3 cursor-pointer transition-all duration-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'tools')}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'tools')}
                    onDoubleClick={() => window.api.openExternal(tool.src)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#000000d9] hover:text-accent-blue transition-colors duration-200">
                          {tool.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Tool - Show only when hovering tools section */}
              {hoveredSection === 'tools' && (
                <div className="mt-4 border border-subtle rounded-lg p-4">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={newTool.name}
                      onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                      placeholder="Name"
                      className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    />
                    <input 
                      type="text" 
                      value={newTool.src}
                      onChange={(e) => setNewTool({...newTool, src: e.target.value})}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTool();
                        }
                      }}
                      placeholder="Source/URL (Press Enter)"
                      className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row - Steps (Full Width) */}
        <div>
          <h4 className="text-base font-normal mb-4">Steps</h4>
          <div 
            className="border border-subtle rounded-lg p-3 md:p-4"
            onMouseEnter={() => setHoveredSection('steps')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-[50px_1fr_1fr] md:grid-cols-[60px_1fr_1fr] border-b border-subtle mb-2">
                  <div className="border-r border-subtle p-2 text-xs md:text-sm font-semibold text-[#00000080]">#</div>
                  <div className="border-r border-subtle p-2 text-xs md:text-sm font-semibold text-[#00000080]">Step</div>
                  <div className="p-2 text-xs md:text-sm font-semibold text-[#00000080]">Reason</div>
                </div>
                
                {(phaseData.steps || []).map((item, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-[50px_1fr_1fr] md:grid-cols-[60px_1fr_1fr] border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'steps')}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'steps')}
                    onDoubleClick={() => {/* Handle edit if needed */}}
                  >
                    <div className="border-r border-subtle p-2 text-xs md:text-sm text-[#000000d9] font-medium">{index + 1}</div>
                    <div className="border-r border-subtle p-2 text-xs md:text-sm text-[#000000d9]">{item.step}</div>
                    <div className="p-2 text-xs md:text-sm text-[#000000d9]">
                      <span>{item.reason}</span>
                    </div>
                  </div>
                ))}
                
                {/* Add New Step Row - Show only when hovering steps section */}
                {hoveredSection === 'steps' && (
                  <div className="grid grid-cols-[50px_1fr_1fr] md:grid-cols-[60px_1fr_1fr]">
                    <div className="border-r border-subtle p-2">
                      <div className="text-xs md:text-sm text-[#00000080] font-medium">{(phaseData.steps || []).length + 1}</div>
                    </div>
                    <div className="border-r border-subtle p-2">
                      <input 
                        type="text" 
                        value={newStep.step}
                        onChange={(e) => setNewStep({...newStep, step: e.target.value})}
                        placeholder="Step"
                        className="w-full bg-surface text-[#000000d9] text-xs md:text-sm border border-subtle rounded-lg px-2 md:px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      />
                    </div>
                    <div className="p-2">
                      <input 
                        type="text" 
                        value={newStep.reason}
                        onChange={(e) => setNewStep({...newStep, reason: e.target.value})}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addStep();
                          }
                        }}
                        placeholder="Reason (Press Enter)"
                        className="w-full bg-surface text-[#000000d9] text-xs md:text-sm border border-subtle rounded-lg px-2 md:px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}