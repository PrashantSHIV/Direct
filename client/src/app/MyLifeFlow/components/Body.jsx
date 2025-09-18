'use client';

import { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

export default function Body() {
  const [activeTab, setActiveTab] = useState('Exercise');
  
  // Shared exercises data
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);

  // Load exercise data and extract categories
  const loadExerciseData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getExercise();
      
      // Group data by section and extract unique section names
      const groupedData = {};
      const uniqueCategories = new Set();
      
      data.forEach(item => {
        if (!groupedData[item.section_name]) {
          groupedData[item.section_name] = [];
        }
        groupedData[item.section_name].push({
          id: item.id,
          name: item.technique_name,
          technique: item.technique_steps
        });
        uniqueCategories.add(item.section_name);
      });
      
      // Convert Set to array and create category objects
      const categoriesArray = Array.from(uniqueCategories).map(categoryName => ({
        id: categoryName,
        name: categoryName
      }));
      
      setCategories(categoriesArray);
      setExercises(groupedData);
    } catch (error) {
      console.error('Error loading exercise data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExerciseData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-text h-full flex items-center justify-center">
          <p className="text-text-muted">Loading exercise data...</p>
        </div>
      );
    }

    switch(activeTab) {
      case 'Exercise':
        return <Exercise categories={categories} setCategories={setCategories} exercises={exercises} setExercises={setExercises} loadExerciseData={loadExerciseData} />;
      case 'Day Table':
        return <DayTable exercises={exercises} categories={categories} />;
      case 'Diet Table':
        return <DietTable />;
      default:
        return <Exercise categories={categories} setCategories={setCategories} exercises={exercises} setExercises={setExercises} loadExerciseData={loadExerciseData} />;
    }
  };

  return (
    <div className="text-text flex flex-col h-full">
      <header className="bg-surface border-b border-subtle flex justify-between items-center p-4 py-1 pr-20">
        <h1 className="text-[#000000d9] font-semibold">Body</h1>
        <nav className="flex gap-2">
          <button 
            onClick={() => setActiveTab('Exercise')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border border-transparent transition-colors duration-200 ${
              activeTab === 'Exercise' ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
            }`}
          >
            Exercise
          </button>
          <button 
            onClick={() => setActiveTab('Day Table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border border-transparent transition-colors duration-200 ${
              activeTab === 'Day Table' ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
            }`}
          >
            Day Table
          </button>
          <button 
            onClick={() => setActiveTab('Diet Table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border border-transparent transition-colors duration-200 ${
              activeTab === 'Diet Table' ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
            }`}
          >
            Diet Table
          </button>
        </nav>
        </header>
        <main className="flex-1">
          {renderContent()}
        </main>
    </div>
  );
}

// Exercise
function Exercise({ categories, setCategories, exercises, setExercises, loadExerciseData }){
  const [activeCategory, setActiveCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newExercise, setNewExercise] = useState({ name: '', technique: [''] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', technique: [''] });
  const [draggedExercise, setDraggedExercise] = useState(null);
  const [draggedCategory, setDraggedCategory] = useState(null);

  useEffect(() => {
    // Set active category to first category if none is selected
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const addCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const newCategoryId = newCategoryName.trim();
        // Add a sample exercise to create the category
        await window.api.addExercise(newCategoryId, 'Sample Exercise', ['Add your exercise steps here']);
        setNewCategoryName('');
        loadExerciseData(); // Reload data to update categories
        setActiveCategory(newCategoryId); // Set the new category as active
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const addExercise = async () => {
    if (newExercise.name.trim() && newExercise.technique[0].trim()) {
      try {
        const filteredTechnique = newExercise.technique.filter(step => step.trim());
        await window.api.addExercise(activeCategory, newExercise.name.trim(), filteredTechnique);
        setNewExercise({ name: '', technique: [''] });
        loadExerciseData(); // Reload data from database
      } catch (error) {
        console.error('Error adding exercise:', error);
      }
    }
  };

  const handleEdit = (exercise, index) => {
    setEditingItem({ exercise, index, category: activeCategory });
    setEditingData({ ...exercise });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteExercise(itemId);
      loadExerciseData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateExercise(editingItem.exercise.id, activeCategory, editingData.name, editingData.technique);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ name: '', technique: [''] });
      loadExerciseData(); // Reload data from database
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const addTechniqueStep = () => {
    setEditingData({...editingData, technique: [...editingData.technique, '']});
  };

  const updateTechniqueStep = (index, value) => {
    const newTechnique = [...editingData.technique];
    newTechnique[index] = value;
    setEditingData({...editingData, technique: newTechnique});
  };

  const removeTechniqueStep = (index) => {
    const newTechnique = editingData.technique.filter((_, i) => i !== index);
    setEditingData({...editingData, technique: newTechnique});
  };

  // Exercise drag and drop functions
  const handleExerciseDragStart = (e, index) => {
    setDraggedExercise(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleExerciseDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedExercise(null);
  };

  const handleExerciseDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleExerciseDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedExercise === null || draggedExercise === dropIndex) return;

    const newExercises = [...(exercises[activeCategory] || [])];
    const draggedExerciseData = newExercises[draggedExercise];
    
    newExercises.splice(draggedExercise, 1);
    newExercises.splice(dropIndex, 0, draggedExerciseData);
    
    // Update local state immediately for smooth UI
    setExercises({...exercises, [activeCategory]: newExercises});
    setDraggedExercise(null);

    // Save new order to database
    try {
      const newOrder = newExercises.map(exercise => exercise.id);
      await window.api.reorderExercise(activeCategory, newOrder);
    } catch (error) {
      console.error('Error reordering exercises:', error);
      // Reload data to revert to original order if there was an error
      loadExerciseData();
    }
  };

  // Category drag and drop functions
  const handleCategoryDragStart = (e, index) => {
    setDraggedCategory(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleCategoryDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedCategory(null);
  };

  const handleCategoryDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedCategory === null || draggedCategory === dropIndex) return;

    const newCategories = [...categories];
    const draggedCategoryData = newCategories[draggedCategory];
    
    newCategories.splice(draggedCategory, 1);
    newCategories.splice(dropIndex, 0, draggedCategoryData);
    
    setCategories(newCategories);
    setDraggedCategory(null);
  };


  // Show message if no categories exist
  if (categories.length === 0) {
    return (
      <div className="text-text h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">No exercise categories found. Create your first category!</p>
          <div className="flex gap-2 justify-center">
            <input 
              type="text" 
              placeholder="Category name (e.g., Stretching, Cardio)" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-border bg-surface text-text px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
            <button 
              onClick={addCategory}
              className="btn px-3 py-2 rounded-lg text-sm hover:opacity-90 transition-all duration-200"
            >
              Create Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text h-full grid grid-cols-[240px_1fr]">
      {/* Left Sidebar - Categories */}
      <aside className="bg-elev-2 border-r border-subtle p-4">
        <nav className="space-y-2 mb-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              draggable
              onDragStart={(e) => handleCategoryDragStart(e, index)}
              onDragEnd={handleCategoryDragEnd}
              onDragOver={handleCategoryDragOver}
              onDrop={(e) => handleCategoryDrop(e, index)}
              onClick={() => setActiveCategory(category.id)}
              className={`block w-full text-left text-sm font-medium px-3 py-2 rounded-lg border border-transparent cursor-move transition-colors duration-200 ${
                activeCategory === category.id ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
        
        <div>
          <input 
            type="text" 
            placeholder="Add new category" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addCategory();
              }
            }}
            className="w-full border border-subtle bg-surface text-[#000000d9] py-2 px-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
          />
        </div>
      </aside>

      {/* Right Content Area */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-normal">{activeCategory}</h4>
        </div>
        
        {/* Exercise Table */}
        <div className="border border-subtle rounded-lg">
          <div className="grid grid-cols-2 border-b border-subtle">
            <div className="border-r border-subtle p-3 text-sm font-semibold text-[#00000080]">Name</div>
            <div className="p-3 text-sm font-semibold text-[#00000080]">Technique</div>
          </div>
          
          {/* Exercise Rows */}
          {(exercises[activeCategory] || []).map((exercise, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200 hover:bg-[#00000009]"
              draggable
              onDragStart={(e) => handleExerciseDragStart(e, index)}
              onDragEnd={handleExerciseDragEnd}
              onDragOver={handleExerciseDragOver}
              onDrop={(e) => handleExerciseDrop(e, index)}
              onDoubleClick={() => handleEdit(exercise, index)}
            >
              <div className="border-r border-subtle p-3 text-sm text-[#000000d9]">{exercise.name}</div>
              <div className="p-3 text-sm text-[#000000d9]">
                <ol className="list-decimal list-inside space-y-1">
                  {exercise.technique.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
          
          {/* Add New Exercise Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-subtle p-3">
              <input 
                type="text" 
                value={newExercise.name}
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                placeholder="Exercise name"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-3 flex flex-col">
              <div className="flex-1 space-y-1">
                {newExercise.technique.map((step, index) => (
                  <input 
                    key={index}
                    type="text" 
                    value={step}
                    onChange={(e) => {
                      const newTechnique = [...newExercise.technique];
                      newTechnique[index] = e.target.value;
                      setNewExercise({...newExercise, technique: newTechnique});
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Always add a new step when Enter is pressed
                        setNewExercise({...newExercise, technique: [...newExercise.technique, '']});
                      }
                    }}
                    placeholder={`Step ${index + 1} (Press Enter to add step)`}
                    className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                ))}
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  onClick={addExercise}
                  className="text-success hover:text-success/80 transition-colors duration-200"
                  title="Add Exercise"
                >
                  <IoMdAdd className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 shadow-card border border-subtle bg-white rounded-lg p-6 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#000000d9]">Edit Exercise</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Name:</label>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Technique Steps:</label>
                <div className="space-y-2">
                  {editingData.technique.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateTechniqueStep(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1 bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      />
                      <button
                        onClick={() => removeTechniqueStep(index)}
                        className="text-danger hover:text-danger/80 px-2 transition-colors duration-200"
                      >
                        <MdOutlineDelete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTechniqueStep}
                    className="text-success hover:text-success/80 text-sm transition-colors duration-200"
                  >
                    + Add Step
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.exercise.id);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ name: '', technique: [''] });
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


// DayTable
function DayTable({ exercises, categories }){
  const [activeDay, setActiveDay] = useState('Monday');
  const [dayExercises, setDayExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [newExercise, setNewExercise] = useState({ name: '', reps: '', setsDuration: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', reps: '', setsDuration: '' });
  const [draggedExercise, setDraggedExercise] = useState(null);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load data from database
  const loadDayTableData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getDayTable();
      
      // Group data by day
      const groupedData = {};
      days.forEach(day => {
        groupedData[day] = [];
      });
      
      data.forEach(item => {
        if (groupedData[item.day]) {
          groupedData[item.day].push({
            id: item.id,
            name: item.exercise_name,
            reps: item.reps,
            setsDuration: item.sets
          });
        }
      });
      
      setDayExercises(groupedData);
    } catch (error) {
      console.error('Error loading day table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDayTableData();
  }, []);

  // Get all available exercises from all categories
  const getAllExercises = () => {
    const allExercises = [];
    categories.forEach(category => {
      exercises[category.id]?.forEach(exercise => {
        allExercises.push({ ...exercise, category: category.name });
      });
    });
    return allExercises;
  };

  const addExercise = async () => {
    if (newExercise.name && newExercise.reps && newExercise.setsDuration) {
      try {
        await window.api.addDayTable(activeDay, newExercise.reps, newExercise.setsDuration, newExercise.name);
        setNewExercise({ name: '', reps: '', setsDuration: '' });
        loadDayTableData(); // Reload data from database
      } catch (error) {
        console.error('Error adding day table exercise:', error);
      }
    }
  };

  const handleEdit = (exercise, index) => {
    setEditingItem({ exercise, index, day: activeDay });
    setEditingData({ ...exercise });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await window.api.deleteDayTable(itemId);
      loadDayTableData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting day table exercise:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await window.api.updateDayTable(editingItem.exercise.id, activeDay, editingData.reps, editingData.setsDuration, editingData.name);
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ name: '', reps: '', setsDuration: '' });
      loadDayTableData(); // Reload data from database
    } catch (error) {
      console.error('Error updating day table exercise:', error);
    }
  };

  // Drag and drop functions
  const handleExerciseDragStart = (e, index) => {
    setDraggedExercise(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleExerciseDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedExercise(null);
  };

  const handleExerciseDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleExerciseDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedExercise === null || draggedExercise === dropIndex) return;

    const newExercises = [...(dayExercises[activeDay] || [])];
    const draggedExerciseData = newExercises[draggedExercise];
    
    newExercises.splice(draggedExercise, 1);
    newExercises.splice(dropIndex, 0, draggedExerciseData);
    
    // Update local state immediately for smooth UI
    setDayExercises({...dayExercises, [activeDay]: newExercises});
    setDraggedExercise(null);

    // Save new order to database
    try {
      const newOrder = newExercises.map(exercise => exercise.id);
      await window.api.reorderDayTable(activeDay, newOrder);
    } catch (error) {
      console.error('Error reordering day table exercises:', error);
      // Reload data to revert to original order if there was an error
      loadDayTableData();
    }
  };

  if (loading) {
    return (
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading day table data...</p>
      </div>
    );
  }

  return (
    <div className="text-text h-full grid grid-cols-[240px_1fr]">
      {/* Left Sidebar - Days */}
      <aside className="bg-elev-2 border-r border-subtle p-4">
        <div className="space-y-1">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`block w-full text-left text-sm font-medium px-3 py-2 rounded-lg border border-transparent transition-colors duration-200 ${
                activeDay === day ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </aside>

      {/* Right Content Area */}
      <section className="p-4">
        <div className="border border-subtle rounded-lg">
          <div className="grid grid-cols-3 border-b border-subtle">
            <div className="border-r border-subtle p-3 text-sm font-semibold text-[#00000080]">Name</div>
            <div className="border-r border-subtle p-3 text-sm font-semibold text-[#00000080]">Reps</div>
            <div className="p-3 text-sm font-semibold text-[#00000080]">Sets/Duration</div>
          </div>
          
          {/* Exercise Rows */}
          {(dayExercises[activeDay] || []).map((exercise, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleExerciseDragStart(e, index)}
              onDragEnd={handleExerciseDragEnd}
              onDragOver={handleExerciseDragOver}
              onDrop={(e) => handleExerciseDrop(e, index)}
              onDoubleClick={() => handleEdit(exercise, index)}
            >
              <div className="border-r border-subtle p-3 text-sm text-[#000000d9]">{exercise.name}</div>
              <div className="border-r border-subtle p-3 text-sm text-[#000000d9]">{exercise.reps}</div>
              <div className="p-3 text-sm text-[#000000d9]">{exercise.setsDuration}</div>
            </div>
          ))}
          
          {/* Add New Exercise Row */}
          <div className="grid grid-cols-3">
            <div className="border-r border-subtle p-3">
              <select 
                value={newExercise.name}
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              >
                <option value="">Select Exercise</option>
                {getAllExercises().map((exercise, index) => (
                  <option key={index} value={exercise.name} className="bg-surface">
                    {exercise.name} ({exercise.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="border-r border-subtle p-3">
              <input 
                type="text" 
                value={newExercise.reps}
                onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                placeholder="Reps (e.g., 18, 15, 12)"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-3">
              <input 
                type="text" 
                value={newExercise.setsDuration}
                onChange={(e) => setNewExercise({...newExercise, setsDuration: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addExercise();
                  }
                }}
                placeholder="Sets/Duration (Press Enter)"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 shadow-card border border-subtle bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#000000d9]">Edit Exercise</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Name:</label>
                <select
                  value={editingData.name}
                  onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                >
                  <option value="">Select Exercise</option>
                  {getAllExercises().map((exercise, index) => (
                    <option key={index} value={exercise.name} className="bg-surface">
                      {exercise.name} ({exercise.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Reps:</label>
                <input
                  type="text"
                  value={editingData.reps}
                  onChange={(e) => setEditingData({...editingData, reps: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Sets/Duration:</label>
                <input
                  type="text"
                  value={editingData.setsDuration}
                  onChange={(e) => setEditingData({...editingData, setsDuration: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.exercise.id);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ name: '', reps: '', setsDuration: '' });
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

function DietTable(){
  const [activeSelection, setActiveSelection] = useState('Diets');
  const [activeDay, setActiveDay] = useState('Monday');
  const [dietItems, setDietItems] = useState([]);
  const [dayItems, setDayItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [newDietItem, setNewDietItem] = useState({ item: '', benefits: '' });
  const [newDayItem, setNewDayItem] = useState({ item: '', quantity: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ item: '', benefits: '', quantity: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load data from database
  const loadDietData = async () => {
    try {
      setLoading(true);
      const [dietData, dailyDietData] = await Promise.all([
        window.api.getDietTable(),
        window.api.getDailyDietTable()
      ]);
      
      
      // Process diet items
      const processedDietItems = dietData.map(item => ({
        id: item.id,
        item: item.name,
        benefits: item.benefits
      }));
      setDietItems(processedDietItems);
      
      // Process daily diet items by day
      const groupedDayItems = {};
      days.forEach(day => {
        groupedDayItems[day] = [];
      });
      
      dailyDietData.forEach(item => {
        if (groupedDayItems[item.day]) {
          groupedDayItems[item.day].push({
            id: item.id,
            item: item.diet_name,
            quantity: item.quantity
          });
        }
      });
      
      setDayItems(groupedDayItems);
    } catch (error) {
      console.error('Error loading diet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDietData();
  }, []);

  const handleDietsClick = () => {
    setActiveSelection('Diets');
  };

  const handleDayClick = (day) => {
    setActiveSelection(day);
    setActiveDay(day);
  };

  const addDietItem = async () => {
    if (newDietItem.item && newDietItem.benefits) {
      try {
        await window.api.addDietTable(newDietItem.item, newDietItem.benefits);
        setNewDietItem({ item: '', benefits: '' });
        loadDietData(); // Reload data from database
      } catch (error) {
        console.error('Error adding diet item:', error);
      }
    }
  };

  const addDayItem = async () => {
    if (newDayItem.item && newDayItem.quantity) {
      try {
        await window.api.addDailyDietTable(activeDay, newDayItem.item, newDayItem.quantity);
        setNewDayItem({ item: '', quantity: '' });
        loadDietData(); // Reload data from database
      } catch (error) {
        console.error('Error adding daily diet item:', error);
      }
    }
  };

  const handleEdit = (item, index, type) => {
    setEditingItem({ item, index, type, day: activeDay });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = async (itemId, type) => {
    try {
      if (type === 'diet') {
        await window.api.deleteDietTable(itemId);
      } else {
        await window.api.deleteDailyDietTable(itemId);
      }
      loadDietData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (editingItem.type === 'diet') {
        await window.api.updateDietTable(editingItem.item.id, editingData.item, editingData.benefits);
      } else {
        await window.api.updateDailyDietTable(editingItem.item.id, activeDay, editingData.item, editingData.quantity);
      }
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ item: '', benefits: '', quantity: '' });
      loadDietData(); // Reload data from database
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    if (activeSelection === 'Diets') {
      const newItems = [...(dietItems || [])];
      const draggedItemData = newItems[draggedItem];
      newItems.splice(draggedItem, 1);
      newItems.splice(dropIndex, 0, draggedItemData);
      
      // Update local state immediately for smooth UI
      setDietItems(newItems);
      setDraggedItem(null);

      // Save new order to database
      try {
        const newOrder = newItems.map(item => item.id);
        await window.api.reorderDietTable(newOrder);
      } catch (error) {
        console.error('Error reordering diet items:', error);
        // Reload data to revert to original order if there was an error
        loadDietData();
      }
    } else {
      const newItems = [...(dayItems[activeDay] || [])];
      const draggedItemData = newItems[draggedItem];
      newItems.splice(draggedItem, 1);
      newItems.splice(dropIndex, 0, draggedItemData);
      
      // Update local state immediately for smooth UI
      setDayItems({...dayItems, [activeDay]: newItems});
      setDraggedItem(null);

      // Save new order to database
      try {
        const newOrder = newItems.map(item => item.id);
        await window.api.reorderDailyDietTable(activeDay, newOrder);
      } catch (error) {
        console.error('Error reordering daily diet items:', error);
        // Reload data to revert to original order if there was an error
        loadDietData();
      }
    }
  };

  const renderContent = () => {
    if (activeSelection === 'Diets') {
      return (
        <div className="border border-subtle rounded-lg">
          <div className="grid grid-cols-2 border-b border-subtle">
            <div className="border-r border-subtle p-3 text-sm font-semibold text-[#00000080]">Item</div>
            <div className="p-3 text-sm font-semibold text-[#00000080]">Benefits</div>
          </div>
          
          {/* Diet Items Rows */}
          {(dietItems || []).map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(item, index, 'diet')}
            >
              <div className="border-r border-subtle p-3 text-sm text-[#000000d9]">{item.item}</div>
              <div className="p-3 text-sm text-[#000000d9]">{item.benefits}</div>
            </div>
          ))}
          
          {/* Add New Diet Item Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-subtle p-3">
              <input 
                type="text" 
                value={newDietItem.item}
                onChange={(e) => setNewDietItem({...newDietItem, item: e.target.value})}
                placeholder="Item name"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
            <div className="p-3">
              <input 
                type="text" 
                value={newDietItem.benefits}
                onChange={(e) => setNewDietItem({...newDietItem, benefits: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addDietItem();
                  }
                }}
                placeholder="Benefits (Press Enter)"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      );
    } else {
      // Day-specific content
      return (
        <div className="border border-subtle rounded-lg">
          <div className="grid grid-cols-2 border-b border-subtle">
            <div className="border-r border-subtle p-3 text-sm font-semibold text-[#00000080]">Item</div>
            <div className="p-3 text-sm font-semibold text-[#00000080]">Quantity</div>
          </div>
          
          {/* Day Items Rows */}
          {(dayItems[activeDay] || []).map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-2 border-b border-subtle group hover:bg-elev-3 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleEdit(item, index, 'day')}
            >
              <div className="border-r border-subtle p-3 text-sm text-[#000000d9]">{item.item}</div>
              <div className="p-3 text-sm text-[#000000d9]">{item.quantity}</div>
            </div>
          ))}
          
          {/* Add New Day Item Row */}
          <div className="grid grid-cols-2">
            <div className="border-r border-subtle p-3">
              <select 
                value={newDayItem.item}
                onChange={(e) => setNewDayItem({...newDayItem, item: e.target.value})}
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              >
                <option value="">Select Diet Item</option>
                {(dietItems || []).map((dietItem, index) => (
                  <option key={index} value={dietItem.item} className="bg-surface">
                    {dietItem.item}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-3">
              <input 
                type="text" 
                value={newDayItem.quantity}
                onChange={(e) => setNewDayItem({...newDayItem, quantity: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addDayItem();
                  }
                }}
                placeholder="Quantity (Press Enter)"
                className="w-full bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="text-text h-full flex items-center justify-center">
        <p className="text-text-muted">Loading diet data...</p>
      </div>
    );
  }

  return (
    <div className="text-text h-full grid grid-cols-[240px_1fr]">
      {/* Left Sidebar - Diets and Days */}
      <aside className="bg-elev-2 border-r border-subtle p-4">
        <button
          onClick={handleDietsClick}
          className={`block w-full text-left text-sm font-medium px-3 py-2 rounded-lg mb-4 border border-transparent transition-colors duration-200 ${
            activeSelection === 'Diets' ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
          }`}
        >
          Diets
        </button>
        
        {/* Days Navigation */}
        <div className="space-y-1">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`block w-full text-left text-sm font-medium px-3 py-2 rounded-lg border border-transparent transition-colors duration-200 ${
                activeSelection === day ? 'border-[#00000013] bg-[#00000013] text-black' : 'text-[#00000080] hover:text-black'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </aside>

      {/* Right Content Area */}
      <section className="p-4">
        {renderContent()}
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-96 shadow-card border border-subtle bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#000000d9]">
              Edit {editingItem?.type === 'diet' ? 'Diet Item' : 'Day Item'}
            </h3>
            
            <div className="space-y-4">
              {editingItem?.type === 'diet' ? (
                <div>
                  <label className="block text-sm mb-1 text-[#00000080]">Item:</label>
                  <input
                    type="text"
                    value={editingData.item}
                    onChange={(e) => setEditingData({...editingData, item: e.target.value})}
                    className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm mb-1 text-[#00000080]">Item:</label>
                  <select
                    value={editingData.item}
                    onChange={(e) => setEditingData({...editingData, item: e.target.value})}
                    className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  >
                    <option value="">Select Diet Item</option>
                    {(dietItems || []).map((dietItem, index) => (
                      <option key={index} value={dietItem.item} className="bg-surface">
                        {dietItem.item} - {dietItem.benefits}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {editingItem?.type === 'diet' ? (
                <div>
                  <label className="block text-sm mb-1 text-[#00000080]">Benefits:</label>
                  <input
                    type="text"
                    value={editingData.benefits}
                    onChange={(e) => setEditingData({...editingData, benefits: e.target.value})}
                    className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm mb-1 text-[#00000080]">Quantity:</label>
                  <input
                    type="text"
                    value={editingData.quantity}
                    onChange={(e) => setEditingData({...editingData, quantity: e.target.value})}
                    className="w-full bg-surface text-[#000000d9] border border-subtle rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.item.id, editingItem.type);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ item: '', benefits: '', quantity: '' });
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