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
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading applications...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-text h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-2">No applications available</p>
          <p className="text-text-muted text-sm">Projects with website links will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-text">Applications</h2>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card hover:bg-elev-3 cursor-pointer transition-all duration-300 hover:shadow-card group"
            onClick={() => handleCardClick(project.projectLink)}
          >
            
            {/* Website Preview iframe */}
            <div className="relative rounded-lg overflow-hidden">
              <div className="w-full h-48 border border-subtle ">
                <iframe
                  src={project.projectLink}
                  className="w-full h-full"
                  title={`${project.name} preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg rounded-tr-4xl text-black font-semibold absolute bg-white border bottom-0 left-0 px-20 py-1">
                {project.name}
              </h3>
            </div>
            
            {/* Click Indicator */}
            <div className="px-4 pb-4">
              <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Click to open website →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
