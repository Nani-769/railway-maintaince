import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters 
}) => {
  const requestTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'preventive', label: 'Preventive Maintenance' },
    { value: 'corrective', label: 'Corrective Maintenance' },
    { value: 'emergency', label: 'Emergency Repair' },
    { value: 'inspection', label: 'Routine Inspection' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filter Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="From Date"
          type="date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
          className="w-full"
        />
        
        <Input
          label="To Date"
          type="date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
          className="w-full"
        />
        
        <Select
          label="Request Type"
          options={requestTypeOptions}
          value={filters?.requestType}
          onChange={(value) => onFilterChange('requestType', value)}
          className="w-full"
        />
        
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          className="w-full"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button 
          variant="default" 
          onClick={onApplyFilters}
          iconName="Filter"
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          iconName="RotateCcw"
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;