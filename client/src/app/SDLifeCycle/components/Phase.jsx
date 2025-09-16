'use client';

import { useState, useEffect } from 'react';

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
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading phase data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      {/* Left Section - Main Content */}
      <div>
        <h4 className="text-base font-semibold mb-4 text-text">{activePhase} Phase</h4>
        
        {/* Definitions Section */}
        <div className="mb-6">
          <div className="space-y-4 mb-4">
            {(phaseData.definitions || []).map((def, index) => (
              <div 
                key={index}
                className="card group hover:bg-elev-3 cursor-pointer transition-all duration-200 hover:shadow-card"
                draggable
                onDragStart={(e) => handleDragStart(e, index, 'definitions')}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, 'definitions')}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold mb-2 text-text">{def.title}</h5>
                    <p className="text-xs text-text-muted">{def.explanation}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem('definitions', def.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 rounded"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add New Definition */}
          <div className="card">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={newDefinition.title}
                  onChange={(e) => setNewDefinition({...newDefinition, title: e.target.value})}
                  placeholder="Question/Title"
                  className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
                <input 
                  type="text" 
                  value={newDefinition.explanation}
                  onChange={(e) => setNewDefinition({...newDefinition, explanation: e.target.value})}
                  placeholder="Answer/Explanation"
                  className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              <button 
                onClick={addDefinition}
                className="text-green-400 hover:text-green-300 ml-2"
                title="Add Definition"
              >
                ➕
              </button>
            </div>
          </div>
        </div>

        {/* Steps Table */}
        <div>
          <div className="grid grid-cols-2 border-b border-border mb-2">
            <div className="border-r border-border p-2 text-sm font-semibold text-text-muted">Step</div>
            <div className="p-2 text-sm font-semibold text-text-muted">Reason</div>
          </div>
          
          {(phaseData.steps || []).map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-border-soft group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index, 'steps')}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, 'steps')}
            >
              <div className="border-r border-border-soft p-2 text-sm text-text">{item.step}</div>
              <div className="p-2 text-sm flex justify-between items-center text-text">
                <span>{item.reason}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem('steps', item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 rounded"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Step Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-border p-2">
              <input 
                type="text" 
                value={newStep.step}
                onChange={(e) => setNewStep({...newStep, step: e.target.value})}
                placeholder="Step"
                className="w-full bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-2 flex items-center justify-between">
              <input 
                type="text" 
                value={newStep.reason}
                onChange={(e) => setNewStep({...newStep, reason: e.target.value})}
                placeholder="Reason"
                className="flex-1 bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
              <button 
                onClick={addStep}
                className="text-green-400 hover:text-green-300 ml-2"
                title="Add Step"
              >
                ➕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Tools */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-normal">Tools</h4>
          <button 
            onClick={addTool}
            className="text-green-400 hover:text-green-300"
            title="Add Tool"
          >
            ➕
          </button>
        </div>
        
        <div className="space-y-2">
          {(phaseData.tools || []).map((tool, index) => (
            <div 
              key={index}
              className="card group hover:bg-elev-3 cursor-pointer transition-all duration-200 hover:shadow-card"
              draggable
              onDragStart={(e) => handleDragStart(e, index, 'tools')}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, 'tools')}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <a 
                    href="#"
                    className="text-sm font-medium text-text hover:text-accent-blue transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.api.openExternal(tool.src);
                    }}
                  >
                    {tool.name}
                  </a>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('tools', tool.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 rounded"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add New Tool */}
        <div className="mt-4 card">
          <div className="space-y-2">
            <input 
              type="text" 
              value={newTool.name}
              onChange={(e) => setNewTool({...newTool, name: e.target.value})}
              placeholder="Name"
              className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
            />
            <input 
              type="text" 
              value={newTool.src}
              onChange={(e) => setNewTool({...newTool, src: e.target.value})}
              placeholder="Source/URL"
              className="w-full bg-transparent text-white text-sm border border-white/50 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
