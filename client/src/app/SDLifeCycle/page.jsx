'use client';

import { useState } from 'react';
import { IoBookOutline } from 'react-icons/io5';
import { TbProgress } from 'react-icons/tb';
import { MdOutlineWork } from 'react-icons/md';
import { IoChevronUp } from 'react-icons/io5';
import { IoChevronDown } from 'react-icons/io5';
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
    <div className="text-text h-full flex flex-col">
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 flex-shrink-0 text-[#000000d9] font-semibold">SD Life Cycle</h3>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[240px_1fr] h-full">
          {/* Left Panel - Navigation */}
          <aside className="bg-elev-2 border-r border-subtle p-4 h-full overflow-y-auto">
            <nav className="space-y-2">
               <button
                 onClick={() => handleSectionClick('Definition')}
                 className={`nav-button ${activeSection === 'Definition' ? 'active' : ''}`}
               >
                <IoBookOutline className="w-4 h-4 mr-3 flex-shrink-0" />
                 Definition
               </button>
              
              {/* Phases Dropdown */}
              <div>
                <button
                  onClick={handlePhasesClick}
                  className={` nav-button ${activePhase ? 'active' : ''}`}
                >
                  <TbProgress className="w-4 h-4 mr-3 flex-shrink-0" />
                  Phases {showPhasesDropdown ? <IoChevronUp className="w-4 h-4 ml-2" /> : <IoChevronDown className="w-4 h-4 ml-2" />}
                </button>
                {showPhasesDropdown && (
                  <div className="ml-4 mt-2 space-y-1">
                    {phases.map((phase) => (
                      <button
                        key={phase}
                        onClick={() => handlePhaseSelect(phase)}
                        className={`block w-full text-left text-text-muted text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-elev-3 hover:text-accent-pink ${
                          activePhase === phase ? 'bg-accent-pink text-text-inverse shadow-card' : ''
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
                 className={`nav-button ${activeSection === 'Projects' ? 'active' : ''}`}
               >
                <MdOutlineWork className="w-4 h-4 mr-3 flex-shrink-0" />
                 Projects
               </button>
            </nav>
          </aside>

          {/* Right Panel - Content */}
          <section className="h-full overflow-y-auto bg-background">
            {renderContent()}
          </section>
        </div>
      </div>

    </div>
  );
}
