import React from 'react';
import Icon from '../../../components/AppIcon';

const LocationSummary = ({ userLocation, locationStats }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Location Summary</h3>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span className="text-sm font-medium">{userLocation}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Train" size={24} className="text-primary" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{locationStats?.totalLocos}</p>
          <p className="text-xs text-muted-foreground">Total Locos</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{locationStats?.activeLocos}</p>
          <p className="text-xs text-muted-foreground">Active Locos</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="AlertTriangle" size={24} className="text-warning" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{locationStats?.maintenanceLocos}</p>
          <p className="text-xs text-muted-foreground">In Maintenance</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="XCircle" size={24} className="text-error" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{locationStats?.outOfServiceLocos}</p>
          <p className="text-xs text-muted-foreground">Out of Service</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSummary;