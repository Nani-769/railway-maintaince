import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RequestTable = ({ 
  requests = [], 
  selectedRequests = [], 
  onSelectionChange, 
  onStatusUpdate,
  onViewDetails,
  onExport,
  sortConfig,
  onSort
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
      approved: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
      completed: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
      rejected: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.bg} ${config?.text} ${config?.border}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
      medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
      low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.bg} ${config?.text} ${config?.border}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(requests?.map(req => req?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRequest = (requestId, checked) => {
    if (checked) {
      onSelectionChange([...selectedRequests, requestId]);
    } else {
      onSelectionChange(selectedRequests?.filter(id => id !== requestId));
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    selectedRequests?.forEach(requestId => {
      onStatusUpdate(requestId, newStatus);
    });
    onSelectionChange([]);
    setShowBulkActions(false);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedRequests?.length > 0 && (
        <div className="bg-primary/5 border-b border-border p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selectedRequests?.length} request{selectedRequests?.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Select
              options={statusOptions}
              placeholder="Update status"
              value=""
              onChange={(value) => handleBulkStatusUpdate(value)}
              className="w-40"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(selectedRequests)}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
              iconName="X"
              iconSize={16}
            />
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedRequests?.length === requests?.length && requests?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('id')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Request ID</span>
                  {getSortIcon('id')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('location')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Location</span>
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Description</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Priority</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('submittedDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Submitted</span>
                  {getSortIcon('submittedDate')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Assigned To</th>
              <th className="text-center p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((request) => (
              <tr key={request?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedRequests?.includes(request?.id)}
                    onChange={(e) => handleSelectRequest(request?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-primary font-medium">
                    {request?.id}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{request?.location}</span>
                  </div>
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-sm text-foreground truncate" title={request?.description}>
                    {request?.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {request?.requestType}
                  </p>
                </td>
                <td className="p-4">
                  {getStatusBadge(request?.status)}
                </td>
                <td className="p-4">
                  {getPriorityBadge(request?.priority)}
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">
                    {formatDate(request?.submittedDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {request?.submittedBy}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">
                    {request?.assignedTo || 'Unassigned'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(request)}
                      iconName="Eye"
                      iconSize={16}
                      className="w-8 h-8 p-0"
                    />
                    <Select
                      options={statusOptions}
                      value={request?.status}
                      onChange={(value) => onStatusUpdate(request?.id, value)}
                      className="w-32"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {requests?.map((request) => (
          <div key={request?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedRequests?.includes(request?.id)}
                  onChange={(e) => handleSelectRequest(request?.id, e?.target?.checked)}
                />
                <span className="font-mono text-sm text-primary font-medium">
                  {request?.id}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(request?.status)}
                {getPriorityBadge(request?.priority)}
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{request?.location}</span>
              </div>
              <p className="text-sm text-foreground">{request?.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Type: {request?.requestType}</span>
                <span>{formatDate(request?.submittedDate)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted by: {request?.submittedBy}
              </div>
              {request?.assignedTo && (
                <div className="text-xs text-muted-foreground">
                  Assigned to: {request?.assignedTo}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(request)}
                iconName="Eye"
                iconPosition="left"
                iconSize={16}
              >
                View Details
              </Button>
              <Select
                options={statusOptions}
                value={request?.status}
                onChange={(value) => onStatusUpdate(request?.id, value)}
                className="w-32"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {requests?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RequestTable;