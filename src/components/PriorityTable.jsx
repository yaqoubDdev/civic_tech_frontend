import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Filter } from 'lucide-react';
import StatusUpdater from './StatusUpdater';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PriorityTable = ({ reports, onStatusChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'priorityScore', direction: 'desc' });
  const [filter, setFilter] = useState('all'); // all, escalated, water

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedReports = [...reports]
    .filter(report => {
      if (filter === 'escalated') return report.priorityScore >= 8;
      if (filter === 'water') return report.category === 'water';
      return true;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Report Priority List</h3>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter reports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="escalated">High Priority (Escalated)</SelectItem>
              <SelectItem value="water">Water Dept Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">ID {getSortIcon('id')}</div>
              </TableHead>
              <TableHead>Title / Category</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('priorityScore')}
              >
                <div className="flex items-center gap-1">Priority {getSortIcon('priorityScore')}</div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">#{report.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-muted-foreground capitalize">{report.category} - {report.type}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    report.priorityScore >= 8 ? 'destructive' : 
                    report.priorityScore >= 5 ? 'default' : 
                    'secondary'
                  }>
                    Score: {report.priorityScore}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    report.status === 'Resolved' ? 'secondary' : 
                    report.status === 'Scheduled' ? 'default' : 
                    'outline'
                  }>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusUpdater 
                    currentStatus={report.status} 
                    onUpdate={(newStatus) => onStatusChange(report.id, newStatus)} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PriorityTable;
