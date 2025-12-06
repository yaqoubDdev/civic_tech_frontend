import React, { useState } from 'react';
import StatusUpdater from './StatusUpdater';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const PriorityTable = ({ reports, onStatusChange }) => {
  const [sortField, setSortField] = useState('priorityScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedReports = [...reports]
    .filter(r => filterDepartment === 'all' || r.department === filterDepartment)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getPriorityColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Priority Report List</h3>
        <select 
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="water">Water</option>
          <option value="roads">Roads</option>
          <option value="power">Power</option>
          <option value="waste">Waste</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priorityScore')}
              >
                Score {sortField === 'priorityScore' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(report.priorityScore)}`}>
                    {report.priorityScore}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{report.title}</div>
                  <div className="text-xs text-gray-500">{report.category} • {report.timeAgo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.address || `${report.location[0].toFixed(4)}, ${report.location[1].toFixed(4)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                      report.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {report.status === 'Resolved' && <CheckCircle size={12} />}
                    {report.status === 'Scheduled' && <Clock size={12} />}
                    {report.status === 'Open' && <AlertTriangle size={12} />}
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusUpdater 
                    currentStatus={report.status} 
                    onUpdate={(newStatus) => onStatusChange(report.id, newStatus)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriorityTable;
