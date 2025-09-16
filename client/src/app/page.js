'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MyLifeFlow from '@/app/MyLifeFlow/page';
import SDLifeCycle from '@/app/SDLifeCycle/page';
import Applications from '@/app/Application\'s/page';
import TasksNext24Hours from '@/app/TasksNext24Hours/page';
import Subjects from '@/app/Subjects/page';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState('MyLifeFlow');

  // Set active page based on query parameter on component mount and when searchParams change
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam && ['MyLifeFlow', 'SDLifeCycle', 'Applications', 'TasksNext24Hours', 'Subjects'].includes(pageParam)) {
      setActivePage(pageParam);
    } else if (!pageParam) {
      // If no page parameter, redirect to MyLifeFlow with query parameter
      router.push('/?page=MyLifeFlow');
    } else {
      // Default to MyLifeFlow if invalid page parameter
      setActivePage('MyLifeFlow');
    }
  }, [searchParams, router]);

  const pages = [
    { id: 'MyLifeFlow', name: 'My Life Flow' },
    { id: 'SDLifeCycle', name: 'SD Life Cycle' },
    { id: 'Applications', name: 'Applications' },
    { id: 'Subjects', name: 'Subjects' },
    { id: 'TasksNext24Hours', name: 'Tasks Next 24 Hours' }
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'MyLifeFlow':
        return <MyLifeFlow />;
      case 'SDLifeCycle':
        return <SDLifeCycle />;
      case 'Applications':
        return <Applications />;
      case 'Subjects':
        return <Subjects />;
      case 'TasksNext24Hours':
        return <TasksNext24Hours />;
      default:
        return <div className="text-white"><p>Select a page from the sidebar</p></div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-10 border-b border-border flex items-center px-6 bg-surface flex-shrink-0">
        <h1 className="text-text font-semibold">
          DIRECT
        </h1>
      </header>

      <main className="grid grid-cols-[260px_1fr] flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="bg-elev-2 border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Logo placeholder */}
            <div className="w-8 h-8 border border-border rounded-lg bg-accent-blue/20 flex items-center justify-center">
              <div className="w-4 h-4 bg-accent-blue rounded"></div>
            </div>
            
            {/* Navigation Buttons */}
            <nav className="space-y-3">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => router.push(`/?page=${page.id}`)}
                  className={`block w-full text-left text-text text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 hover:bg-elev-3 hover:text-accent-blue ${
                    activePage === page.id ? 'bg-accent-blue text-text-inverse shadow-card' : ''
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area - Renders active component */}
        <section className="bg-background overflow-y-auto">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
