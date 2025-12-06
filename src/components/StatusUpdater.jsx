import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const StatusUpdater = ({ currentStatus, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const statuses = ['Open', 'Scheduled', 'Resolved'];

  const handleStatusClick = (status) => {
    if (status === 'Resolved' && currentStatus !== 'Resolved') {
      setShowResolutionModal(true);
      setIsOpen(false);
    } else {
      onUpdate(status);
      setIsOpen(false);
    }
  };

  const handleResolutionSubmit = () => {
    onUpdate('Resolved', resolutionNote);
    setShowResolutionModal(false);
    setResolutionNote('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Update <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentStatus === status ? 'font-bold text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {showResolutionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Resolve Issue</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please add a note about how this issue was resolved.
            </p>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Pothole filled with asphalt..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResolutionModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleResolutionSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Check size={16} /> Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusUpdater;
