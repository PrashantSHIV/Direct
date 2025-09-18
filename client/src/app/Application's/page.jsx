'use client';
import { useState, useEffect } from 'react';

export default function Applications() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load projects data
  const loadProjectsData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getProjects();
        console.log(data)
      // Filter projects that have projectLink and sort by newest first
      const filteredProjects = data
        .filter(project => project.projectLink && project.projectLink.trim() !== '')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log(filteredProjects)
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  // Handle card click - redirect to project website
  const handleCardClick = (projectLink) => {
    if (projectLink) {
      // Use shell.openExternal to open in system browser
      window.api.openExternal(projectLink);
    }
  };

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Applications</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#00000080]">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Applications</h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#00000080] text-lg mb-2">No applications available</p>
            <p className="text-[#00000080] text-sm">Projects with website links will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Applications</h3>
      
      <div className="p-6 flex-1 overflow-y-auto">
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-subtle rounded-xl p-4 hover:bg-elev-3 cursor-pointer transition-all duration-300 hover:shadow-lg group"
            onClick={() => handleCardClick(project.projectLink)}
          >
            
            {/* Website Preview */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <div className="w-full h-32 border border-subtle rounded-lg overflow-hidden relative">
                <iframe
                  src={project.projectLink}
                  title={`${project.name} preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  style={{
                    width: '200%',
                    height: '200%',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    border: 'none'
                  }}
                />
              </div>
              <h3 className="text-sm font-semibold text-[#000000d9] absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-subtle">
                {project.name}
              </h3>
            </div>
            
            {/* Click Indicator */}
            <div className="mt-2">
              <div className="text-xs text-[#00000080] opacity-0 group-hover:opacity-100 transition-opacity text-center">
                Click to open website →
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
