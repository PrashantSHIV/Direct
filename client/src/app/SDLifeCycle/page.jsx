'use client';

import { useState, useEffect } from 'react';
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
  const [showPhasesModal, setShowPhasesModal] = useState(false);

  const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];

  const handlePhasesClick = () => {
    // On mobile (when screen is small), show modal instead of dropdown
    if (window.innerWidth < 768) {
      setShowPhasesModal(true);
    } else {
      setShowPhasesDropdown(!showPhasesDropdown);
    }
  };

  const handlePhaseSelect = (phase) => {
    setActivePhase(phase);
    setActiveSection('Phases'); // Only set section when a phase is actually selected
    setShowPhasesModal(false); // Close modal after selection
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
      <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 flex-shrink-0 text-[#000000d9] font-semibold text-sm md:text-base">SD Life Cycle</h3>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid h-full transition-all duration-300 grid-cols-[80px_1fr] md:grid-cols-[260px_1fr]">
          {/* Left Panel - Navigation */}
          <aside className="bg-elev-2 border-r border-subtle h-full overflow-y-auto transition-all duration-300 p-3">
            <nav className="space-y-2">
               <button
                 onClick={() => handleSectionClick('Definition')}
                 className={`nav-button ${activeSection === 'Definition' ? 'active' : ''} justify-start px-2 md:px-4 whitespace-nowrap`}
                 title="Definition"
               >
                <IoBookOutline className="w-5 h-5 flex-shrink-0 md:mr-3" />
                <span className="hidden md:inline">Definition</span>
               </button>
              
              {/* Phases Dropdown */}
              <div>
                <button
                  onClick={handlePhasesClick}
                  className={`nav-button ${activePhase ? 'active' : ''} justify-start px-2 md:px-4 whitespace-nowrap`}
                  title="Phases"
                >
                  <TbProgress className="w-5 h-5 flex-shrink-0 md:mr-3" />
                  <span className="hidden md:flex items-center">
                    Phases {showPhasesDropdown ? <IoChevronUp className="w-4 h-4 ml-2" /> : <IoChevronDown className="w-4 h-4 ml-2" />}
                  </span>
                </button>
                {showPhasesDropdown && (
                  <div className="ml-4 mt-2 space-y-1 hidden md:block">
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
                 className={`nav-button ${activeSection === 'Projects' ? 'active' : ''} justify-start px-2 md:px-4 whitespace-nowrap`}
                 title="Projects"
               >
                <MdOutlineWork className="w-5 h-5 flex-shrink-0 md:mr-3" />
                <span className="hidden md:inline">Projects</span>
               </button>
            </nav>
          </aside>

          {/* Right Panel - Content */}
          <section className="h-full overflow-y-auto bg-background">
            {renderContent()}
          </section>
        </div>
      </div>

      {/* Phases Modal for Mobile */}
      {showPhasesModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:hidden"
          onClick={() => setShowPhasesModal(false)}
        >
          <div 
            className="w-80 md:w-96 max-w-[90vw] shadow-card border border-subtle bg-white rounded-lg p-4 md:p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-[#000000d9]">Select Phase</h3>
            <div className="space-y-2">
              {phases.map((phase) => (
                <button
                  key={phase}
                  onClick={() => handlePhaseSelect(phase)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    activePhase === phase 
                      ? 'bg-accent-blue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPhasesModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
