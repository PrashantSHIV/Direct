'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiPhpmyadmin, SiTask } from 'react-icons/si';
import { GrCycle } from 'react-icons/gr';
import { MdApps, MdOutlineSubject } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import MyLifeFlow from '@/app/MyLifeFlow/page';
import SDLifeCycle from '@/app/SDLifeCycle/page';
import Applications from '@/app/Application\'s/page';
import TasksNext24Hours from '@/app/TasksNext24Hours/page';
import Subjects from '@/app/Subjects/page';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState('MyLifeFlow');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set active page based on query parameter on component mount and when searchParams change
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam && ['MyLifeFlow', 'SDLifeCycle', 'Applications', 'TasksNext24Hours', 'Subjects'].includes(pageParam)) {
      setActivePage(pageParam);
    } else if (!pageParam) {
      // If no page parameter, redirect to MyLifeFlow with query parameter
      router.push('/home?page=MyLifeFlow');
    } else {
      // Default to MyLifeFlow if invalid page parameter
      setActivePage('MyLifeFlow');
    }
  }, [searchParams, router]);

  // Handle responsive behavior and mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const pages = [
    { id: 'MyLifeFlow', name: 'My Life Flow', icon: SiPhpmyadmin },
    { id: 'SDLifeCycle', name: 'SD Life Cycle', icon: GrCycle },
    { id: 'Applications', name: 'Applications', icon: MdApps },
    { id: 'Subjects', name: 'Subjects', icon: MdOutlineSubject },
    { id: 'TasksNext24Hours', name: 'Tasks Next 24 Hours', icon: SiTask }
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="pt-3 pb-2 border-b border-subtle flex items-center px-4 md:px-6 bg-surface flex-shrink-0">
        <h1 className="font-semibold text-sm md:text-base">
          DIRECT
        </h1>
      </header>

      <main className={`flex flex-1 min-h-0 transition-all duration-300 ${sidebarCollapsed ? 'grid-cols-[80px_1fr]' : 'grid-cols-[260px_1fr]'} grid`}>
        {/* Sidebar */}
        <aside className={`border-r border-subtle overflow-y-auto transition-all duration-300 p-3`}>
          <div className="space-y-6">
            {/* Hamburger Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center justify-start px-4 py-3 rounded-lg hover:bg-elev-3 transition-colors duration-200"
            >
              <RxHamburgerMenu className="w-5 h-5 text-[#00000080]" />
            </button>
            
            {/* Navigation Buttons */}
            <nav className="space-y-3">
              {pages.map((page) => {
                const IconComponent = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      router.push(`/home?page=${page.id}`);
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    className={`nav-button ${activePage === page.id ? 'active' : ''} ${sidebarCollapsed ? 'justify-start px-2' : ''} whitespace-nowrap`}
                    title={sidebarCollapsed ? page.name : ''}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                    {!sidebarCollapsed && page.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area - Renders active component */}
        <section className=" overflow-y-auto">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-blue mx-auto"></div>
          <p className="mt-4 text-[#00000080]">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
