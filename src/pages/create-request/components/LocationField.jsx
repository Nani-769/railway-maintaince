import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LocationField = ({ 
  value, 
  onChange, 
  error, 
  userLocation, 
  canOverride = false,
  isOverriding,
  onToggleOverride 
}) => {
  const availableLocations = [
    { value: 'mumbai-central', label: 'Mumbai Central', description: 'Western Railway Zone' },
    { value: 'new-delhi', label: 'New Delhi', description: 'Northern Railway Zone' },
    { value: 'howrah', label: 'Howrah', description: 'Eastern Railway Zone' },
    { value: 'chennai-central', label: 'Chennai Central', description: 'Southern Railway Zone' },
    { value: 'secunderabad', label: 'Secunderabad', description: 'South Central Railway Zone' },
    { value: 'pune', label: 'Pune', description: 'Central Railway Zone' },
    { value: 'kanpur', label: 'Kanpur', description: 'North Central Railway Zone' },
    { value: 'bhubaneswar', label: 'Bhubaneswar', description: 'East Coast Railway Zone' }
  ];

  if (!isOverriding) {
    return (
      <div className="mb-6">
        <Input
          label="Location"
          description="Your assigned maintenance location"
          type="text"
          value={userLocation}
          disabled
          className="bg-muted"
        />
        {canOverride && (
          <button
            type="button"
            onClick={onToggleOverride}
            className="mt-2 flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="MapPin" size={16} />
            <span>Request for different location</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">Location Override</label>
        <button
          type="button"
          onClick={onToggleOverride}
          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={16} />
          <span>Cancel</span>
        </button>
      </div>
      <Select
        placeholder="Select different location..."
        description="Choose location for cross-zone request"
        options={availableLocations}
        value={value}
        onChange={onChange}
        error={error}
        required
        searchable
      />
    </div>
  );
};

export default LocationField;