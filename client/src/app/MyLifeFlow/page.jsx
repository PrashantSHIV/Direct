'use client';

import { useState, useEffect } from 'react';
import { CiViewTable } from 'react-icons/ci';
import { GoGoal } from 'react-icons/go';
import { IoBody } from 'react-icons/io5';
import { RiBrainFill } from 'react-icons/ri';
import { MdOutlineRememberMe } from 'react-icons/md';
import TimeTable from './components/TimeTable';
import Goals from './components/Goals';
import Body from './components/Body';
import Mind from './components/Mind';
import Remember from './components/Remember';

export default function MyLifeFlow() {
  const [activeComponent, setActiveComponent] = useState('TimeTable');

  const components = [
    { id: 'TimeTable', name: 'Time Table', icon: CiViewTable },
    { id: 'Goals', name: 'Goals', icon: GoGoal },
    { id: 'Body', name: 'Body', icon: IoBody },
    { id: 'Mind', name: 'Mind', icon: RiBrainFill },
    { id: 'Remember', name: 'Remember', icon: MdOutlineRememberMe }
  ];

  const renderContent = () => {
    switch(activeComponent) {
      case 'TimeTable':
        return <TimeTable />;
      case 'Goals':
        return <Goals />;
      case 'Body':
        return <Body />;
      case 'Mind':
        return <Mind />;
      case 'Remember':
        return <Remember />;
      default:
        return <div className="text-white"><p>Select a component from the sidebar</p></div>;
    }
  };

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 flex-shrink-0 text-[#000000d9] font-semibold text-sm md:text-base">My Life Flow</h3>
      
      <main className="transition-all duration-300 grid grid-cols-[80px_1fr] md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="bg-elev-2 border-r border-subtle overflow-y-auto transition-all duration-300 p-3">
          <nav className="space-y-2">
            {components.map((component) => {
              const IconComponent = component.icon;
              return (
                <button
                  key={component.id}
                  onClick={() => setActiveComponent(component.id)}
                  className={`nav-button ${activeComponent === component.id ? 'active' : ''} justify-start px-2 md:px-4 whitespace-nowrap`}
                  title={component.name}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0 md:mr-3" />
                  <span className="hidden md:inline">{component.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="bg-background overflow-y-auto">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
