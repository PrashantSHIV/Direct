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
    <div className="text-text flex flex-col h-full">
      <header className="h-12 bg-surface border-b border-border flex items-center px-6">
        <h2 className="text-lg font-semibold">My Life Flow</h2>
      </header>
      
      <main className="grid grid-cols-[240px_1fr] flex-1">
        {/* Sidebar */}
        <aside className="bg-elev-2 border-r border-border p-4">
          <nav className="space-y-2">
            {components.map((component) => (
              <button
                key={component.id}
                onClick={() => setActiveComponent(component.id)}
                className={`block w-full text-left text-text text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-elev-3 hover:text-accent-blue ${
                  activeComponent === component.id ? 'bg-accent-blue text-text-inverse shadow-card' : ''
                }`}
              >
                {component.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="bg-background">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
