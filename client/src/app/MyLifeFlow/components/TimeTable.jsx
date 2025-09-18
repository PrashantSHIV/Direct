import { useState, useEffect } from "react";

export default function TimeTable() {
  const [workingDayData, setWorkingDayData] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ time: '', discipline: '' });
  const [newWorkingItem, setNewWorkingItem] = useState({ time: '', discipline: '' });
  const [newHolidayItem, setNewHolidayItem] = useState({ time: '', discipline: '' });

  // Load data from database on component mount
  useEffect(() => {
    loadTimetableData();
  }, []);

  const loadTimetableData = async () => {
    try {
      setLoading(true);
      const data = await window.api.getTimetable();

      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : [];
      
      // Separate working day and holiday data
      const workingData = dataArray.filter(item => item.type === 'working day');
      const holidayData = dataArray.filter(item => item.type === 'holiday');
      
      setWorkingDayData(workingData);
      setHolidayData(holidayData);
    } catch (error) {
      console.error('Error loading timetable data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item, index, section) => {
    setEditingItem({ item, index, section });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = async (index, section) => {
    try {
      const item = section === 'working' ? workingDayData[index] : holidayData[index];
      await window.api.deleteTimetable(item.id);
      await loadTimetableData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting timetable item:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const item = editingItem.section === 'working' ? workingDayData[editingItem.index] : holidayData[editingItem.index];
      const type = editingItem.section === 'working' ? 'working day' : 'holiday';
      
      await window.api.updateTimetable(item.id, type, editingData.time, editingData.discipline);
      await loadTimetableData(); // Reload data from database
      
      setShowEditModal(false);
      setEditingItem(null);
      setEditingData({ time: '', discipline: '' });
    } catch (error) {
      console.error('Error updating timetable item:', error);
    }
  };

  const handleAddNew = async (section) => {
    try {
      if (section === 'working' && newWorkingItem.time && newWorkingItem.discipline) {
        await window.api.addTimetable('working day', newWorkingItem.time, newWorkingItem.discipline);
        setNewWorkingItem({ time: '', discipline: '' });
        await loadTimetableData(); // Reload data from database
      } else if (section === 'holiday' && newHolidayItem.time && newHolidayItem.discipline) {
        await window.api.addTimetable('holiday', newHolidayItem.time, newHolidayItem.discipline);
        setNewHolidayItem({ time: '', discipline: '' });
        await loadTimetableData(); // Reload data from database
      }
    } catch (error) {
      console.error('Error adding timetable item:', error);
    }
  };

  const renderTable = (data, section, newItem, setNewItem) => {
    return (
      <div>
        <div className="border-b border-subtle pb-2 mb-4 font-semibold text-[#000000d9]">
          {section === 'working' ? 'Working Day' : 'Holiday'}
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-subtle">
              <td className="py-2 px-3 text-[#00000080] font-medium text-sm">Time</td>
              <td className="px-3 text-[#00000080] font-medium text-sm">Discipline</td>
            </tr>
          </thead>
          <tbody>
            {data.sort((a,b) => a.time.localeCompare(b.time)).map((row, index) => (
              <tr 
                key={index} 
                className="border-b border-subtle hover:bg-elev-3 cursor-pointer transition-all duration-200"
                onDoubleClick={() => handleEdit(row, index, section)}
              >
                <td className="py-2 px-3 text-[#000000d9] font-medium text-sm">{row.time}</td>
                <td className="px-3 text-[#000000d9] text-sm">{row.discipline}</td>
              </tr>
            ))}
            <tr className="rounded-lg hover:bg-elev-3 transition-all duration-200 opacity-0 hover:opacity-100">
              <td className="py-2 px-3">
                <input 
                  type="time" 
                  value={newItem.time}
                  onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                  className="bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </td>
              <td className="px-3" colSpan="2">
                <input
                  type="text"
                  value={newItem.discipline}
                  onChange={(e) => setNewItem({...newItem, discipline: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNew(section);
                    }
                  }}
                  placeholder="Discipline (Press Enter)"
                  className="bg-surface text-[#000000d9] text-sm border border-subtle rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Time Table</h3>
        <div className="p-6 text-center">
          <p className="text-text-muted">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="bg-surface border-b border-subtle p-4 pt-3 pb-2 text-[#000000d9] font-semibold">Time Table</h3>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Working Day Section */}
          <div className="border-r border-subtle pr-6">
            {renderTable(workingDayData, 'working', newWorkingItem, setNewWorkingItem)}
          </div>
          
          {/* Holiday Section */}
          <div className="pl-6">
            {renderTable(holidayData, 'holiday', newHolidayItem, setNewHolidayItem)}
          </div>
        </div>
      </div>

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
            <h3 className="font-semibold mb-4 text-[#000000d9]">Edit Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Time:</label>
                <input
                  type="time"
                  value={editingData.time}
                  onChange={(e) => setEditingData({...editingData, time: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-[#00000080]">Discipline:</label>
                <input
                  type="text"
                  value={editingData.discipline}
                  onChange={(e) => setEditingData({...editingData, discipline: e.target.value})}
                  className="w-full bg-surface text-[#000000d9] border border-subtle rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  handleDelete(editingItem.index, editingItem.section);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingData({ time: '', discipline: '' });
                }}
                className="px-4 py-2 bg-danger text-text-inverse rounded hover:opacity-90 transition-all duration-200"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-elev-3 text-[#000000d9] rounded hover:bg-elev-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-accent-blue text-text-inverse rounded hover:opacity-90 transition-all duration-200"
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