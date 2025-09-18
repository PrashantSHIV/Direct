'use client';
import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProject, setExpandedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState(null);
  const [draggedProject, setDraggedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    date: new Date(),
    insight: '',
    owner: '',
    ownerWork: '',
    creator: [],
    githubLink: '',
    projectLink: '',
    documentsLink: [],
    startDate: new Date(),
    endDate: new Date(),
    status: 'active'
  });

  // Load projects from database
  const loadProjectsData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getProjects();
      console.log('Projects data loaded:', data);
      
      // Map data to component structure
      const mappedData = data.map(project => ({
        id: project.id,
        name: project.name,
        date: new Date(project.date),
        insight: project.insight,
        owner: project.owner,
        ownerWork: project.ownerWork,
        creator: project.creator || [],
        githubLink: project.githubLink,
        projectLink: project.projectLink,
        documentsLink: project.documentsLink || [],
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        status: project.status
      }));
      
      setProjects(mappedData);
    } catch (error) {
      console.error('Error loading projects data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  // Calculate progress percentage based on time elapsed
  const calculateProgress = (project) => {
    if (project.status === 'completed') return 100;
    if (!project.endDate) return 0;
    
    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    // If project hasn't started yet
    if (now < start) return 0;
    
    // If project has ended
    if (now > end) return 100;
    
    // Calculate progress percentage: (currentDate - startDate) / (endDate - startDate) * 100
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const progress = (elapsed / totalDuration) * 100;
    
    return Math.round(Math.min(100, Math.max(0, progress)));
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.insight.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // First, separate active and completed projects
      const aIsCompleted = a.status === 'completed';
      const bIsCompleted = b.status === 'completed';
      
      // If one is completed and other is active, active comes first
      if (aIsCompleted && !bIsCompleted) return 1;
      if (!aIsCompleted && bIsCompleted) return -1;
      
      // If both are active, sort by urgency (least time remaining first)
      if (!aIsCompleted && !bIsCompleted) {
        const aProgress = calculateProgress(a);
        const bProgress = calculateProgress(b);
        
        // If both have end dates, sort by progress (higher progress = more urgent)
        if (a.endDate && b.endDate) {
          return bProgress - aProgress;
        }
        
        // If only one has end date, prioritize the one with end date
        if (a.endDate && !b.endDate) return -1;
        if (!a.endDate && b.endDate) return 1;
        
        // If neither has end date, sort by creation date (newest first)
        return new Date(b.date) - new Date(a.date);
      }
      
      // If both are completed, sort by creation date (newest first)
      return new Date(b.date) - new Date(a.date);
    });

  // Get color opacity based on progress
  const getColorOpacity = (progress) => {
    // Higher progress = higher opacity (more urgent)
    // 0-20%: 0.3 opacity (far from deadline)
    // 21-50%: 0.5 opacity (moderate)
    // 51-80%: 0.7 opacity (getting close)
    // 81-100%: 0.9 opacity (very close/overdue)
    if (progress <= 20) return 0.3;
    if (progress <= 50) return 0.5;
    if (progress <= 80) return 0.7;
    return 0.9;
  };

  const handleProjectDoubleClick = (project) => {
    // If clicking on already expanded project, close it
    if (expandedProject === project.id) {
      setExpandedProject(null);
    } else {
      // Otherwise, expand this project (automatically closes any other expanded project)
      setExpandedProject(project.id);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await window.api.deleteProject(projectId);
      if (expandedProject === projectId) {
        setExpandedProject(null);
      }
      loadProjectsData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateProject = (project) => {
    setProjectToUpdate(project);
    setShowUpdateModal(true);
  };

  const handleCreateProject = async () => {
    if (newProject.name.trim()) {
      try {
        const projectData = {
          name: newProject.name.trim(),
          date: newProject.date.toISOString(),
          insight: newProject.insight,
          owner: newProject.owner,
          ownerWork: newProject.ownerWork,
          createdBy: newProject.owner, // Using owner as createdBy for now
          githubLink: newProject.githubLink,
          projectLink: newProject.projectLink,
          creators: newProject.creator.filter(c => c.trim()),
          documents: newProject.documentsLink.filter(d => d.name.trim() && d.src.trim()),
          startDate: newProject.startDate.toISOString().split('T')[0],
          endDate: newProject.endDate.toISOString().split('T')[0],
          status: newProject.status
        };
        
        await window.api.addProject(
          projectData.name,
          projectData.date,
          projectData.insight,
          projectData.owner,
          projectData.ownerWork,
          projectData.createdBy,
          projectData.githubLink,
          projectData.projectLink,
          projectData.creators,
          projectData.documents,
          projectData.startDate,
          projectData.endDate,
          projectData.status
        );
        
        setShowCreateModal(false);
        setNewProject({
          name: '',
          date: new Date(),
          insight: '',
          owner: '',
          ownerWork: '',
          creator: [],
          githubLink: '',
          projectLink: '',
          documentsLink: [],
          startDate: new Date(),
          endDate: new Date(),
          status: 'active'
        });
        loadProjectsData(); // Reload data from database
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  const handleUpdateProjectSubmit = async () => {
    if (projectToUpdate && projectToUpdate.name.trim()) {
      try {
        const projectData = {
          name: projectToUpdate.name.trim(),
          date: projectToUpdate.date.toISOString(),
          insight: projectToUpdate.insight,
          owner: projectToUpdate.owner,
          ownerWork: projectToUpdate.ownerWork,
          createdBy: projectToUpdate.owner, // Using owner as createdBy for now
          githubLink: projectToUpdate.githubLink,
          projectLink: projectToUpdate.projectLink,
          creators: projectToUpdate.creator || [],
          documents: projectToUpdate.documentsLink || [],
          startDate: projectToUpdate.startDate.toISOString().split('T')[0],
          endDate: projectToUpdate.endDate.toISOString().split('T')[0],
          status: projectToUpdate.status
        };
        
        await window.api.updateProject(
          projectToUpdate.id,
          projectData.name,
          projectData.date,
          projectData.insight,
          projectData.owner,
          projectData.ownerWork,
          projectData.createdBy,
          projectData.githubLink,
          projectData.projectLink,
          projectData.creators,
          projectData.documents,
          projectData.startDate,
          projectData.endDate,
          projectData.status
        );
        
        setShowUpdateModal(false);
        setProjectToUpdate(null);
        loadProjectsData(); // Reload data from database
      } catch (error) {
        console.error('Error updating project:', error);
      }
    }
  };

  // Document management functions for update modal
  const addUpdateDocument = () => {
    setProjectToUpdate({
      ...projectToUpdate,
      documentsLink: [...(projectToUpdate.documentsLink || []), { name: '', src: '' }]
    });
  };

  const updateUpdateDocument = (index, field, value) => {
    const newDocuments = [...(projectToUpdate.documentsLink || [])];
    newDocuments[index] = { ...newDocuments[index], [field]: value };
    setProjectToUpdate({
      ...projectToUpdate,
      documentsLink: newDocuments
    });
  };

  const removeUpdateDocument = (index) => {
    const newDocuments = (projectToUpdate.documentsLink || []).filter((_, i) => i !== index);
    setProjectToUpdate({
      ...projectToUpdate,
      documentsLink: newDocuments
    });
  };

  const addCreator = () => {
    setNewProject({
      ...newProject,
      creator: [...newProject.creator, '']
    });
  };

  const updateCreator = (index, value) => {
    const newCreators = [...newProject.creator];
    newCreators[index] = value;
    setNewProject({
      ...newProject,
      creator: newCreators
    });
  };

  const removeCreator = (index) => {
    const newCreators = newProject.creator.filter((_, i) => i !== index);
    setNewProject({
      ...newProject,
      creator: newCreators
    });
  };

  const addDocument = () => {
    setNewProject({
      ...newProject,
      documentsLink: [...newProject.documentsLink, { name: '', src: '' }]
    });
  };

  const updateDocument = (index, field, value) => {
    const newDocuments = [...newProject.documentsLink];
    newDocuments[index] = { ...newDocuments[index], [field]: value };
    setNewProject({
      ...newProject,
      documentsLink: newDocuments
    });
  };

  const removeDocument = (index) => {
    const newDocuments = newProject.documentsLink.filter((_, i) => i !== index);
    setNewProject({
      ...newProject,
      documentsLink: newDocuments
    });
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : '-';
  };

  const formatArray = (arr) => {
    return arr && arr.length > 0 ? arr.join(', ') : '-';
  };

  // Drag and drop functions
  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedProject(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropProject) => {
    e.preventDefault();
    if (draggedProject === null || draggedProject.id === dropProject.id) return;

    const newProjects = [...projects];
    const draggedIndex = newProjects.findIndex(p => p.id === draggedProject.id);
    const dropIndex = newProjects.findIndex(p => p.id === dropProject.id);
    
    const draggedItemData = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(dropIndex, 0, draggedItemData);
    
    setProjects(newProjects);
    setDraggedProject(null);

    // Save new order to database
    try {
      await window.api.reorderProjects(newProjects);
    } catch (error) {
      console.error('Error reordering projects:', error);
      // Reload data from database to revert changes
      loadProjectsData();
    }
  };

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 text-sm md:text-base text-[#000000d9] font-semibold">Projects</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#00000080]">Loading projects data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-3 md:p-4 pt-3 pb-2 text-sm md:text-base text-[#000000d9] font-semibold">Projects</h3>
      
      <div className="p-3 md:p-6 flex-1 overflow-y-auto">
      {/* Header with Search and New Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div className="flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-subtle rounded-lg bg-surface text-[#000000d9] placeholder-[#00000080] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
          />
        </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-3 md:px-4 py-2 md:py-3 bg-accent-blue text-text-inverse rounded-lg text-xs md:text-sm font-medium hover:opacity-90 transition-all duration-200"
          >
            New
          </button>
        </div>

      {/* Project Cards Columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-3 md:gap-4">
        {filteredProjects.map((project) => {
          const progress = calculateProgress(project);
          const opacity = getColorOpacity(progress);
          const isCompleted = project.status === 'completed';
          const isExpanded = expandedProject === project.id;
          
          return (
            <div 
              key={project.id}
              className={`bg-white border border-subtle rounded-xl p-3 md:p-5 cursor-pointer transition-all duration-300 break-inside-avoid mb-4 md:mb-6 ${
                isCompleted ? 'opacity-50 bg-gray-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, project)}
              onDoubleClick={() => handleProjectDoubleClick(project)}
                style={{
                backgroundColor: !isCompleted && project.endDate 
                  ? `rgba(52, 211, 153, ${opacity * 0.08})` // Subtle green background with calculated opacity
                  : undefined,
                minHeight: 'fit-content',
                height: 'auto'
              }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
              <div className="flex-1">
                  <h3 className={`text-sm md:text-base font-bold mb-1 md:mb-2 ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                    {project.projectLink ? (
                      <a 
                        href="#" 
                        className="hover:underline hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          window.api.openExternal(project.projectLink);
                        }}
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-2 md:mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <p className={`text-xs text-[#00000080]`}>
                    Created: {formatDate(project.date)}
                  </p>
                 <span className={`text-xs px-2 md:px-3 py-1 rounded-lg font-medium ${
                   isCompleted 
                     ? 'bg-gray-200 text-gray-500' 
                     : project.endDate 
                       ? `bg-green-100 text-green-700` 
                       : 'bg-gray-100 text-gray-600'
                 }`}>
                  {isCompleted ? 'Completed' : 'Active'}
                  {!isCompleted && project.endDate && ` (${progress}%)`}
                </span>
                </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="space-y-2 md:space-y-3 border-t border-subtle pt-2 md:pt-3">
                {/* Action Buttons - Only show when expanded */}
                <div className="flex gap-1 md:gap-2 mb-2 md:mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateProject(project);
                    }}
                    className="px-2 md:px-3 py-1 text-xs border border-subtle rounded-lg hover:bg-elev-3 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="px-2 md:px-3 py-1 text-xs border border-danger text-danger rounded-lg hover:bg-danger hover:text-text-inverse transition-all duration-200"
                  >
                    Delete
                  </button>
            </div>

            {/* Insight */}
            <div>
                  <label className="block text-xs mb-1 text-[#00000080]">Insight</label>
                  <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                    {project.insight || '-'}
              </div>
            </div>

            {/* Owner and Owner Work */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1 text-[#00000080]">Owner</label>
                    <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                      {project.owner || '-'}
                </div>
              </div>
                  <div>
                    <label className="block text-xs mb-1 text-[#00000080]">Owner Work</label>
                    <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                      {project.ownerWork || '-'}
                </div>
              </div>
            </div>

            {/* Creator */}
            <div>
                  <label className="block text-xs mb-1 text-[#00000080]">Creator</label>
                  <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                    {formatArray(project.creator)}
              </div>
            </div>

            {/* Links */}
                <div>
                    <label className="block text-xs mb-1 text-[#00000080]">Project Links</label>
                    <div className="space-y-1">
                        {project.githubLink && (
                            <div>
                            <a 
                                href="#"
                                className={`text-xs font-medium hover:underline hover:text-gray-600 transition-colors ${
                                isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  window.api.openExternal(project.githubLink);
                                }}
                            >
                                GitHub Repository
                            </a>
                </div>
                        )}
                        {project.projectLink && (
            <div>
                            <a 
                                href="#"
                                className={`text-xs font-medium hover:underline hover:text-gray-600 transition-colors ${
                                isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  window.api.openExternal(project.projectLink);
                                }}
                            >
                                Live Project
                            </a>
                  </div>
                )}
              </div>
            </div>

                {/* Project Documents */}
                {project.documentsLink && project.documentsLink.length > 0 && (
                  <div>
                    <label className="block text-xs mb-1 text-[#00000080]">Documents</label>
                    <div className="space-y-1">
                      {project.documentsLink.map((doc, index) => (
                        <div key={index}>
                          {doc.src ? (
                            <a 
                              href="#"
                              className={`text-xs font-medium hover:underline hover:text-gray-600 transition-colors ${
                                isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                window.api.openExternal(doc.src);
                              }}
                            >
                              {doc.name}
                            </a>
                          ) : (
                            <div className={`text-xs font-medium ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                              {doc.name}
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              </div>
                )}

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1 text-[#00000080]">Start Date</label>
                    <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                      {formatDate(project.startDate)}
                </div>
              </div>
            <div>
                    <label className="block text-xs mb-1 text-[#00000080]">End Date</label>
                    <div className={`text-xs ${isCompleted ? 'text-[#00000080]' : 'text-[#000000d9]'}`}>
                      {formatDate(project.endDate)}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
          );
        })}
      </div>

      {/* No Projects Message */}
      {filteredProjects.length === 0 && (
        <div className="flex items-center justify-center h-64 text-[#00000080]">
          {searchTerm ? 'No projects found matching your search.' : 'No projects available. Create a new project to get started.'}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="w-88 md:w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card border border-subtle bg-white rounded-lg p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-[#000000d9]">Create New Project</h3>
            
            <div className="space-y-3 md:space-y-4">
              {/* Name and Date */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Project name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Date</label>
                  <input
                    type="date"
                    value={newProject.date.toISOString().split('T')[0]}
                    onChange={(e) => setNewProject({ ...newProject, date: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Insight */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Insight</label>
                <input
                  type="text"
                  value={newProject.insight}
                  onChange={(e) => setNewProject({ ...newProject, insight: e.target.value })}
                  className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  placeholder="Project insight"
                />
              </div>

              {/* Owner and Owner Work */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Owner</label>
                  <input
                    type="text"
                    value={newProject.owner}
                    onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Project owner"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Owner Work</label>
                  <input
                    type="text"
                    value={newProject.ownerWork}
                    onChange={(e) => setNewProject({ ...newProject, ownerWork: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Owner's work"
                  />
                </div>
              </div>

              {/* Creator */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Creator</label>
                <div className="space-y-2">
                  {newProject.creator.map((creator, index) => (
                    <div key={index} className="flex gap-1 md:gap-2">
                      <input
                        type="text"
                        value={creator}
                        onChange={(e) => updateCreator(index, e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        placeholder="Creator name"
                      />
                      <button
                        onClick={() => removeCreator(index)}
                        className="px-2 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCreator}
                    className="px-2 md:px-3 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                  >
                    + Add Creator
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Github Link</label>
                  <input
                    type="url"
                    value={newProject.githubLink}
                    onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="GitHub repository URL"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Project Link (if live)</label>
                  <input
                    type="url"
                    value={newProject.projectLink}
                    onChange={(e) => setNewProject({ ...newProject, projectLink: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Live project URL"
                  />
                </div>
              </div>

              {/* Project Documents Link */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Project Documents Link</label>
                <div className="space-y-2">
                  {newProject.documentsLink.map((doc, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-1 md:gap-2">
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => updateDocument(index, 'name', e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        placeholder="Document name"
                      />
                      <input
                        type="url"
                        value={doc.src}
                        onChange={(e) => updateDocument(index, 'src', e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        placeholder="Document URL"
                      />
                      <button
                        onClick={() => removeDocument(index)}
                        className="px-2 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDocument}
                    className="px-2 md:px-3 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                  >
                    + Add Document
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewProject({ ...newProject, startDate: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewProject({ ...newProject, endDate: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 md:mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-elev-3 text-[#000000d9] rounded-lg hover:bg-elev-2 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Project Modal */}
      {showUpdateModal && projectToUpdate && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div 
            className="w-88 md:w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card border border-subtle bg-white rounded-lg p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-[#000000d9]">Update Project</h3>
            
            <div className="space-y-3 md:space-y-4">
              {/* Name and Date */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Name</label>
                  <input
                    type="text"
                    value={projectToUpdate.name}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, name: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Project name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Date</label>
                  <input
                    type="date"
                    value={projectToUpdate.date.toISOString().split('T')[0]}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, date: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Insight */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Insight</label>
                <input
                  type="text"
                  value={projectToUpdate.insight}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, insight: e.target.value })}
                  className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  placeholder="Project insight"
                />
              </div>

              {/* Owner and Owner Work */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Owner</label>
                  <input
                    type="text"
                    value={projectToUpdate.owner}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, owner: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Project owner"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Owner Work</label>
                  <input
                    type="text"
                    value={projectToUpdate.ownerWork}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, ownerWork: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Owner's work"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Github Link</label>
                  <input
                    type="url"
                    value={projectToUpdate.githubLink}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, githubLink: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="GitHub repository URL"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Project Link (if live)</label>
                  <input
                    type="url"
                    value={projectToUpdate.projectLink}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, projectLink: e.target.value })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Live project URL"
                  />
                </div>
              </div>

              {/* Project Documents Link */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Project Documents Link</label>
                <div className="space-y-2">
                  {(projectToUpdate.documentsLink || []).map((doc, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-1 md:gap-2">
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => updateUpdateDocument(index, 'name', e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        placeholder="Document name"
                      />
                      <input
                        type="url"
                        value={doc.src}
                        onChange={(e) => updateUpdateDocument(index, 'src', e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        placeholder="Document URL"
                      />
                      <button
                        onClick={() => removeUpdateDocument(index)}
                        className="px-2 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addUpdateDocument}
                    className="px-2 md:px-3 py-1 border border-subtle rounded-lg text-xs md:text-sm hover:bg-elev-3 transition-all duration-200"
                  >
                    + Add Document
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Start Date</label>
                  <input
                    type="date"
                    value={projectToUpdate.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, startDate: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs md:text-sm mb-1 text-[#00000080]">End Date</label>
                  <input
                    type="date"
                    value={projectToUpdate.endDate.toISOString().split('T')[0]}
                    onChange={(e) => setProjectToUpdate({ ...projectToUpdate, endDate: new Date(e.target.value) })}
                    className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs md:text-sm mb-1 text-[#00000080]">Status</label>
                <select
                  value={projectToUpdate.status}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, status: e.target.value })}
                  className="w-full px-2 md:px-3 py-2 border border-subtle rounded-lg bg-surface text-[#000000d9] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 md:mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-elev-3 text-[#000000d9] rounded-lg hover:bg-elev-2 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProjectSubmit}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}