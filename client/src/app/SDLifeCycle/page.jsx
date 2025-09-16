'use client';

import { useState } from 'react';
import Definition from './components/Definition';
import Phase from './components/Phase';
import Projects from './components/Projects';

export default function SDLifeCycle() {
  const [activeSection, setActiveSection] = useState('Definition');
  const [activePhase, setActivePhase] = useState(null);
  const [showPhasesDropdown, setShowPhasesDropdown] = useState(false);

  const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];

  const handlePhasesClick = () => {
    setShowPhasesDropdown(!showPhasesDropdown);
    // Don't change activeSection, keep showing current content
  };

  const handlePhaseSelect = (phase) => {
    setActivePhase(phase);
    setActiveSection('Phases'); // Only set section when a phase is actually selected
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    // Clear active phase when switching to non-phase sections
    if (section !== 'Phases') {
      setActivePhase(null);
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'Definition':
        return <Definition />;
      case 'Phases':
        return activePhase ? <Phase activePhase={activePhase} /> : <div className="text-white"><p>Select a phase from the dropdown</p></div>;
      case 'Projects':
        return <Projects />;
      default:
        return <div className="text-white"><p>Select a section</p></div>;
    }
  };

  return (
    <div className="text-white h-full flex flex-col">
      <h3 className="bg-gray-600 p-3 py-2 flex-shrink-0">SD Life Cycle</h3>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[240px_1fr] gap-6 h-full">
          {/* Left Panel - Navigation */}
          <aside className=" bg-gray-500 p-4 h-full overflow-y-auto">
            <nav className="space-y-2">
               <button
                 onClick={() => handleSectionClick('Definition')}
                 className={`block w-full text-left text-white text-sm font-normal px-3 py-2 rounded hover:bg-gray-600 ${
                   activeSection === 'Definition' ? 'border border-white bg-gray-600' : ''
                 }`}
               >
                 Definition
               </button>
              
              {/* Phases Dropdown */}
              <div>
                <button
                  onClick={handlePhasesClick}
                  className={`block w-full text-left text-white text-sm font-normal px-3 py-2 rounded hover:bg-gray-600 ${
                    activePhase ? 'border border-white bg-gray-600' : ''
                  }`}
                >
                  Phases {showPhasesDropdown ? '▲' : '▼'}
                </button>
                {showPhasesDropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {phases.map((phase) => (
                      <button
                        key={phase}
                        onClick={() => handlePhaseSelect(phase)}
                        className={`block w-full text-left text-white text-xs font-normal px-3 py-1 rounded hover:bg-gray-600 ${
                          activePhase === phase ? 'border border-white bg-gray-600' : ''
                        }`}
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
               <button
                 onClick={() => handleSectionClick('Projects')}
                 className={`block w-full text-left text-white text-sm font-normal px-3 py-2 rounded hover:bg-gray-600 ${
                   activeSection === 'Projects' ? 'border border-white bg-gray-600' : ''
                 }`}
               >
                 Projects
               </button>
            </nav>
          </aside>

          {/* Right Panel - Content */}
          <section className="p-4 h-full overflow-y-auto">
            {renderContent()}
          </section>
        </div>
      </div>

    </div>
  );
}
