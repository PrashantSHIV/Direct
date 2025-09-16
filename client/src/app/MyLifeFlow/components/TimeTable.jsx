import { useState } from "react";

export default function TimeTable() {
  // Working Day Data
  const workingData = [
    { time: "04:00", discipline: "Get Up" },
    { time: "04:30", discipline: "Brush Teeth" },
    { time: "05:00", discipline: "Exercise" },
    { time: "06:00", discipline: "Shower" },
    { time: "07:00", discipline: "Breakfast" },
    { time: "08:00", discipline: "Work Start" },
    { time: "12:00", discipline: "Lunch Break" },
    { time: "13:00", discipline: "Work Resume" },
    { time: "17:00", discipline: "Work End" },
    { time: "18:00", discipline: "Dinner" },
    { time: "19:00", discipline: "Study" },
    { time: "21:00", discipline: "Relax" },
    { time: "22:00", discipline: "Sleep" }
  ];
  
  // Holiday Data
  const holiData = [
    { time: "06:00", discipline: "Wake Up" },
    { time: "06:30", discipline: "Morning Walk" },
    { time: "08:00", discipline: "Breakfast" },
    { time: "09:00", discipline: "Hobby Time" },
    { time: "12:00", discipline: "Lunch" },
    { time: "14:00", discipline: "Nap" },
    { time: "16:00", discipline: "Family Time" },
    { time: "18:00", discipline: "Dinner" },
    { time: "20:00", discipline: "Entertainment" },
    { time: "22:00", discipline: "Sleep" }
  ];

  const [workingDayData, setWorkingDayData] = useState(workingData);
  const [holidayData, setHolidayData] = useState(holiData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingData, setEditingData] = useState({ time: '', discipline: '' });
  const [newWorkingItem, setNewWorkingItem] = useState({ time: '', discipline: '' });
  const [newHolidayItem, setNewHolidayItem] = useState({ time: '', discipline: '' });

  const handleEdit = (item, index, section) => {
    setEditingItem({ item, index, section });
    setEditingData({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (index, section) => {
    if (section === 'working') {
      setWorkingDayData(workingDayData.filter((_, i) => i !== index));
    } else {
      setHolidayData(holidayData.filter((_, i) => i !== index));
    }
  };

  const handleSaveEdit = () => {
    if (editingItem.section === 'working') {
      const newData = [...workingDayData];
      newData[editingItem.index] = { ...editingData };
      setWorkingDayData(newData.sort((a,b) => a.time.localeCompare(b.time)));
    } else {
      const newData = [...holidayData];
      newData[editingItem.index] = { ...editingData };
      setHolidayData(newData.sort((a,b) => a.time.localeCompare(b.time)));
    }
    setShowEditModal(false);
    setEditingItem(null);
    setEditingData({ time: '', discipline: '' });
  };

  const handleAddNew = (section) => {
    if (section === 'working' && newWorkingItem.time && newWorkingItem.discipline) {
      const newData = [...workingDayData, { ...newWorkingItem }];
      setWorkingDayData(newData.sort((a,b) => a.time.localeCompare(b.time)));
      setNewWorkingItem({ time: '', discipline: '' });
    } else if (section === 'holiday' && newHolidayItem.time && newHolidayItem.discipline) {
      const newData = [...holidayData, { ...newHolidayItem }];
      setHolidayData(newData.sort((a,b) => a.time.localeCompare(b.time)));
      setNewHolidayItem({ time: '', discipline: '' });
    }
  };

  const renderTable = (data, section, newItem, setNewItem) => {
    return (
      <div>
        <div className="border-b border-border pb-2 mb-4 text-sm font-semibold text-text">
          {section === 'working' ? 'Working Day' : 'Holiday'}
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <td className="py-2 px-3 text-text-muted font-medium">Time</td>
              <td className="px-3 text-text-muted font-medium">Discipline</td>
            </tr>
          </thead>
          <tbody>
            {data.sort((a,b) => a.time.localeCompare(b.time)).map((row, index) => (
              <tr key={index} className="border-b border-border-soft hover:bg-elev-3 group relative transition-all duration-200">
                <td className="py-2 px-3 text-text font-medium">{row.time}</td>
                <td className="px-3 text-text">{row.discipline}</td>
                <td className="px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={() => handleEdit(row, index, section)}
                    className="text-accent-blue hover:text-accent-blue/80 mr-2 transition-colors duration-200"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(index, section)}
                    className="text-danger hover:text-danger/80 transition-colors duration-200"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border border-border rounded-lg hover:bg-elev-3 transition-all duration-200">
              <td className="py-2 px-3">
                <input 
                  type="time" 
                  value={newItem.time}
                  onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                  className="bg-surface text-text text-sm border border-border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </td>
              <td className="px-3">
                <input 
                  type="text" 
                  value={newItem.discipline}
                  onChange={(e) => setNewItem({...newItem, discipline: e.target.value})}
                  placeholder="Discipline"
                  className="bg-surface text-text text-sm border border-border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                />
              </td>
              <td className="px-3">
                <button 
                  onClick={() => handleAddNew(section)}
                  className="text-success hover:text-success/80 transition-colors duration-200"
                  title="Add"
                >
                  ➕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="text-white">
      <h3 className="bg-gray-500 p-3 py-2">Time Table</h3>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Working Day Section */}
          <div className="border-r border-white pr-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Time:</label>
                <input
                  type="time"
                  value={editingData.time}
                  onChange={(e) => setEditingData({...editingData, time: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Discipline:</label>
                <input
                  type="text"
                  value={editingData.discipline}
                  onChange={(e) => setEditingData({...editingData, discipline: e.target.value})}
                  className="w-full bg-transparent text-white border border-white/50 rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}