'use client';

import { useState } from 'react';
import TimeTable from './components/TimeTable';
import Goals from './components/Goals';
import Body from './components/Body';
import Mind from './components/Mind';
import Remember from './components/Remember';

export default function MyLifeFlow() {
  const [activeComponent, setActiveComponent] = useState('TimeTable');

  const components = [
    { id: 'TimeTable', name: 'Time Table' },
    { id: 'Goals', name: 'Goals' },
    { id: 'Body', name: 'Body' },
    { id: 'Mind', name: 'Mind' },
    { id: 'Remember', name: 'Remember' }
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
    <div className="text-white flex flex-col h-full">
      <header className="h-10 bg-gray-700 flex items-center px-4">
        <h2 className="text-lg font-normal">My Life Flow</h2>
      </header>
      
      <main className="grid grid-cols-[240px_1fr] flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-600 p-4">
          <nav className="space-y-2">
            {components.map((component) => (
              <button
                key={component.id}
                onClick={() => setActiveComponent(component.id)}
                className={`block w-full text-left text-white text-sm font-normal px-3 py-2 rounded hover:bg-gray-500 ${
                  activeComponent === component.id ? 'border border-gray-400 bg-gray-500' : ''
                }`}
              >
                {component.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section>
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
