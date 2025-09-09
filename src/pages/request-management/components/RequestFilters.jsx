import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const RequestFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  requestStats = { total: 0, pending: 0, approved: 0, completed: 0, rejected: 0 }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'mumbai-central', label: 'Mumbai Central' },
    { value: 'delhi-junction', label: 'Delhi Junction' },
    { value: 'chennai-central', label: 'Chennai Central' },
    { value: 'kolkata-howrah', label: 'Kolkata Howrah' },
    { value: 'bangalore-city', label: 'Bangalore City' },
    { value: 'hyderabad-deccan', label: 'Hyderabad Deccan' },
    { value: 'pune-junction', label: 'Pune Junction' },
    { value: 'ahmedabad-junction', label: 'Ahmedabad Junction' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const requestTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'routine-maintenance', label: 'Routine Maintenance' },
    { value: 'emergency-repair', label: 'Emergency Repair' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'upgrade', label: 'Upgrade' },
    { value: 'replacement', label: 'Replacement' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning',
      approved: 'text-primary',
      completed: 'text-success',
      rejected: 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-lg font-semibold text-foreground mb-2">Request Management</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-foreground font-medium">
              Total: <span className="text-primary">{requestStats?.total}</span>
            </span>
            <span className={`font-medium ${getStatusColor('pending')}`}>
              Pending: {requestStats?.pending}
            </span>
            <span className={`font-medium ${getStatusColor('approved')}`}>
              Approved: {requestStats?.approved}
            </span>
            <span className={`font-medium ${getStatusColor('completed')}`}>
              Completed: {requestStats?.completed}
            </span>
            <span className={`font-medium ${getStatusColor('rejected')}`}>
              Rejected: {requestStats?.rejected}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear All
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by request ID, description, or user..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="max-w-md"
        />
      </div>
      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-fade-in">
          <Select
            label="Location"
            options={locationOptions}
            value={filters?.location || ''}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Select location"
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Select status"
          />
          
          <Select
            label="Request Type"
            options={requestTypeOptions}
            value={filters?.requestType || ''}
            onChange={(value) => handleFilterChange('requestType', value)}
            placeholder="Select type"
          />
          
          <div className="space-y-4">
            <Input
              type="date"
              label="From Date"
              value={filters?.fromDate || ''}
              onChange={(e) => handleFilterChange('fromDate', e?.target?.value)}
            />
            <Input
              type="date"
              label="To Date"
              value={filters?.toDate || ''}
              onChange={(e) => handleFilterChange('toDate', e?.target?.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestFilters;