import React from 'react';
import Select from '../../../components/ui/Select';

const RequestTypeSelect = ({ value, onChange, error }) => {
  const requestTypes = [
    { value: 'preventive', label: 'Preventive Maintenance', description: 'Scheduled routine maintenance' },
    { value: 'corrective', label: 'Corrective Maintenance', description: 'Fix identified issues' },
    { value: 'emergency', label: 'Emergency Repair', description: 'Urgent breakdown repair' },
    { value: 'inspection', label: 'Safety Inspection', description: 'Regulatory compliance check' },
    { value: 'upgrade', label: 'System Upgrade', description: 'Component or software upgrade' },
    { value: 'modification', label: 'Modification Work', description: 'Structural or system changes' },
    { value: 'cleaning', label: 'Deep Cleaning', description: 'Thorough cleaning service' },
    { value: 'calibration', label: 'Equipment Calibration', description: 'Precision instrument adjustment' }
  ];

  return (
    <Select
      label="Request Type"
      description="Select the type of maintenance request"
      placeholder="Choose maintenance type..."
      options={requestTypes}
      value={value}
      onChange={onChange}
      error={error}
      required
      searchable
      className="mb-6"
    />
  );
};

export default RequestTypeSelect;