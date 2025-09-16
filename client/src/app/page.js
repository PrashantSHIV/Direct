'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MyLifeFlow from '@/app/MyLifeFlow/page';
import SDLifeCycle from '@/app/SDLifeCycle/page';
import Applications from '@/app/Application\'s/page';
import TasksNext24Hours from '@/app/TasksNext24Hours/page';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState('MyLifeFlow');

  // Set active page based on query parameter on component mount and when searchParams change
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam && ['MyLifeFlow', 'SDLifeCycle', 'Applications', 'TasksNext24Hours'].includes(pageParam)) {
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
      case 'TasksNext24Hours':
        return <TasksNext24Hours />;
      default:
        return <div className="text-white"><p>Select a page from the sidebar</p></div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="h-16 border-b border-gray-600 flex items-center px-6">
        <h1 className="text-white text-2xl font-normal">
          DIRECT
        </h1>
      </header>

      <main className="grid grid-cols-[260px_1fr] flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-800 border-r border-gray-600 p-6">
          <div className="space-y-6">
            {/* Logo placeholder */}
            <div className="w-8 h-8 border border-gray-400 rounded bg-transparent"></div>
            
            {/* Navigation Buttons */}
            <nav className="space-y-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => router.push(`/?page=${page.id}`)}
                  className={`block w-full text-left text-white text-base font-normal px-3 py-2 rounded hover:bg-gray-700 ${
                    activePage === page.id ? 'border border-gray-400 bg-gray-700' : ''
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area - Renders active component */}
        <section className="bg-gray-800">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
