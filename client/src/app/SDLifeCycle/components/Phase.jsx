'use client';

import { useState } from 'react';

export default function Phase({ activePhase }) {
  const [phaseData, setPhaseData] = useState({
    Planning: {
      name: 'Planning',
      definitions: [
        { title: 'What is Planning?', explanation: 'Planning phase is the initial stage where project scope, requirements, and timeline are defined.' }
      ],
      tools: [
        { name: 'Project Management Tool', src: 'https://example.com/pm' },
        { name: 'Requirements Tracker', src: 'https://example.com/req' }
      ],
      steps: [
        { step: 'Define project scope', reason: 'To understand what needs to be built' },
        { step: 'Gather requirements', reason: 'To know what features are needed' },
        { step: 'Create timeline', reason: 'To plan development schedule' }
      ]
    },
    Design: {
      name: 'Design',
      definitions: [
        { title: 'What is Design?', explanation: 'Design phase involves creating system architecture and design specifications.' }
      ],
      tools: [
        { name: 'Figma', src: 'https://figma.com' },
        { name: 'Sketch', src: 'https://sketch.com' }
      ],
      steps: [
        { step: 'Create system architecture', reason: 'To define overall system structure' },
        { step: 'Design user interface', reason: 'To plan user experience' },
        { step: 'Create technical specifications', reason: 'To guide development' }
      ]
    },
    Development: {
      name: 'Development',
      definitions: [
        { title: 'What is Development?', explanation: 'Development phase is where the actual coding and system building takes place.' }
      ],
      tools: [
        { name: 'VS Code', src: 'https://code.visualstudio.com' },
        { name: 'Git', src: 'https://git-scm.com' }
      ],
      steps: [
        { step: 'Write code', reason: 'To implement the system' },
        { step: 'Follow coding standards', reason: 'To maintain code quality' },
        { step: 'Regular testing', reason: 'To catch bugs early' }
      ]
    },
    Testing: {
      name: 'Testing',
      definitions: [
        { title: 'What is Testing?', explanation: 'Testing phase ensures the system works correctly and meets requirements.' }
      ],
      tools: [
        { name: 'Jest', src: 'https://jestjs.io' },
        { name: 'Selenium', src: 'https://selenium.dev' }
      ],
      steps: [
        { step: 'Unit testing', reason: 'To test individual components' },
        { step: 'Integration testing', reason: 'To test component interactions' },
        { step: 'User acceptance testing', reason: 'To validate with end users' }
      ]
    },
    Deployment: {
      name: 'Deployment',
      definitions: [
        { title: 'What is Deployment?', explanation: 'Deployment phase involves releasing the system to production environment.' }
      ],
      tools: [
        { name: 'Docker', src: 'https://docker.com' },
        { name: 'AWS', src: 'https://aws.amazon.com' }
      ],
      steps: [
        { step: 'Prepare production environment', reason: 'To ensure system stability' },
        { step: 'Deploy application', reason: 'To make system available to users' },
        { step: 'Monitor system', reason: 'To ensure smooth operation' }
      ]
    },
    Maintenance: {
      name: 'Maintenance',
      definitions: [
        { title: 'What is Maintenance?', explanation: 'Maintenance phase involves ongoing support, updates, and improvements.' }
      ],
      tools: [
        { name: 'Monitoring Tool', src: 'https://example.com/monitor' },
        { name: 'Bug Tracker', src: 'https://example.com/bugs' }
      ],
      steps: [
        { step: 'Bug fixes', reason: 'To resolve issues found in production' },
        { step: 'Feature updates', reason: 'To add new functionality' },
        { step: 'Performance optimization', reason: 'To improve system efficiency' }
      ]
    }
  });

  const [newStep, setNewStep] = useState({ step: '', reason: '' });
  const [newDefinition, setNewDefinition] = useState({ title: '', explanation: '' });
  const [newTool, setNewTool] = useState({ name: '', src: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedType, setDraggedType] = useState(null);

  const addStep = () => {
    if (newStep.step.trim() && newStep.reason.trim()) {
      const updatedData = { ...phaseData };
      updatedData[activePhase].steps.push({
        step: newStep.step.trim(),
        reason: newStep.reason.trim()
      });
      setPhaseData(updatedData);
      setNewStep({ step: '', reason: '' });
    }
  };

  const addDefinition = () => {
    if (newDefinition.title.trim() && newDefinition.explanation.trim()) {
      const updatedData = { ...phaseData };
      updatedData[activePhase].definitions.push({
        title: newDefinition.title.trim(),
        explanation: newDefinition.explanation.trim()
      });
      setPhaseData(updatedData);
      setNewDefinition({ title: '', explanation: '' });
    }
  };

  const addTool = () => {
    if (newTool.name.trim() && newTool.src.trim()) {
      const updatedData = { ...phaseData };
      updatedData[activePhase].tools.push({
        name: newTool.name.trim(),
        src: newTool.src.trim()
      });
      setPhaseData(updatedData);
      setNewTool({ name: '', src: '' });
    }
  };

  const deleteItem = (type, index) => {
    const updatedData = { ...phaseData };
    updatedData[activePhase][type].splice(index, 1);
    setPhaseData(updatedData);
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

  const handleDrop = (e, dropIndex, type) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex || draggedType !== type) return;

    const updatedData = { ...phaseData };
    const items = updatedData[activePhase][type];
    const draggedItemData = items[draggedItem];
    
    items.splice(draggedItem, 1);
    items.splice(dropIndex, 0, draggedItemData);
    
    setPhaseData(updatedData);
    setDraggedItem(null);
    setDraggedType(null);
  };

  const currentPhase = phaseData[activePhase] || phaseData.Planning;

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      {/* Left Section - Main Content */}
      <div>
        <h4 className="text-base font-semibold mb-4 text-text">{activePhase} Phase</h4>
        
        {/* Definitions Section */}
        <div className="mb-6">
          <div className="space-y-4 mb-4">
            {currentPhase.definitions.map((def, index) => (
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
                        deleteItem('definitions', index);
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
          
          {currentPhase.steps.map((item, index) => (
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
                    deleteItem('steps', index);
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
          {currentPhase.tools.map((tool, index) => (
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
                    href={tool.src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-text hover:text-accent-blue transition-colors duration-200"
                  >
                    {tool.name}
                  </a>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('tools', index);
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
