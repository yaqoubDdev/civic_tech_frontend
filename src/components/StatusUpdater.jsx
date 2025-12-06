import React from 'react';

const StatusUpdater = ({ currentStatus, onUpdate }) => {
  const handleChange = (e) => {
    onUpdate(e.target.value);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${currentStatus === 'Resolved' ? 'bg-green-100 text-green-800' : 
          currentStatus === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
          'bg-gray-100 text-gray-800'}`}
    >
      <option value="Open">Open</option>
      <option value="Scheduled">Scheduled</option>
      <option value="Resolved">Resolved</option>
    </select>
  );
};

export default StatusUpdater;
