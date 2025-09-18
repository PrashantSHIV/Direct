'use client';

import { useState, useEffect } from 'react';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({ name: '', reason: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', reason: '' });
  const [draggedSubject, setDraggedSubject] = useState(null);

  // Load data from database
  const loadSubjectsData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getSubjects();
      console.log('Subjects data loaded:', data);
      
      // Map data to component structure
      const mappedData = data.map(item => ({
        id: item.id,
        name: item.name,
        reason: item.reason
      }));
      
      setSubjects(mappedData);
    } catch (error) {
      console.error('Error loading subjects data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjectsData();
  }, []);

  const addSubject = async () => {
    if (newSubject.name.trim() && newSubject.reason.trim()) {
      try {
        await window.api.addSubjects(newSubject.name.trim(), newSubject.reason.trim());
        setNewSubject({ name: '', reason: '' });
        loadSubjectsData(); // Reload data from database
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const handleEdit = (subject, index) => {
    setEditingItem({ subject, index });
    setEditingData({ ...subject });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteSubjects(itemId);
      loadSubjectsData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateSubjects(editingItem.subject.id, editingData.name, editingData.reason);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ name: '', reason: '' });
      loadSubjectsData(); // Reload data from database
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedSubject(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedSubject(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedSubject === null || draggedSubject === dropIndex) return;

    const newSubjects = [...(subjects || [])];
    const draggedSubjectData = newSubjects[draggedSubject];
    
    newSubjects.splice(draggedSubject, 1);
    newSubjects.splice(dropIndex, 0, draggedSubjectData);
    
    // Update local state immediately for smooth UI
    setSubjects(newSubjects);
    setDraggedSubject(null);

    // Save new order to database
    try {
      const newOrder = newSubjects.map(subject => subject.id);
      await window.api.reorderSubjects(newOrder);
      console.log('Subjects reordered successfully');
    } catch (error) {
      console.error('Error reordering subjects:', error);
      // Reload data to revert to original order if there was an error
      loadSubjectsData();
    }
  };

  if (loading) {
    return (
      <div className="text-text flex flex-col h-full">
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Subjects</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#00000080]">Loading subjects data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text flex flex-col h-full">
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Subjects</h3>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Add New Subject */}
        <div className="mb-6">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              placeholder="Subject name"
              className="flex-1 border border-subtle bg-surface text-[#000000d9] px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
            />
            <input 
              type="text" 
              value={newSubject.reason}
              onChange={(e) => setNewSubject({...newSubject, reason: e.target.value})}
              placeholder="Reason for studying"
              className="flex-1 border border-subtle bg-surface text-[#000000d9] px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
            />
            <button 
              onClick={addSubject}
              className="px-4 py-3 bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-3">
          {(subjects || []).map((subject, index) => (
            <div 
              key={subject.id} 
              className="bg-white border border-subtle rounded-lg p-4 group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(subject, index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#000000d9] mb-2">{subject.name}</h3>
                  <p className="text-sm text-[#00000080]">{subject.reason}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(subject, index);
                    }}
                    className="text-gray-600 hover:text-gray-800 text-xs px-3 py-1 border border-subtle rounded-lg hover:bg-elev-3 transition-all duration-200"
                    title="Edit Subject"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(subject.id);
                    }}
                    className="text-gray-600 hover:text-gray-800 text-xs px-3 py-1 border border-subtle rounded-lg hover:bg-elev-3 transition-all duration-200"
                    title="Delete Subject"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#00000080] mb-4">No subjects found. Add your first subject!</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 max-w-[90vw] shadow-card border border-subtle bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#000000d9]">Edit Subject</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#00000080]">Subject Name:</label>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#00000080]">Reason for Studying:</label>
                <input
                  type="text"
                  value={editingData.reason}
                  onChange={(e) => setEditingData({...editingData, reason: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.subject.id);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ name: '', reason: '' });
                }}
                className="px-4 py-2 bg-danger text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-elev-3 text-[#000000d9] rounded-lg hover:bg-elev-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-accent-blue text-text-inverse rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
