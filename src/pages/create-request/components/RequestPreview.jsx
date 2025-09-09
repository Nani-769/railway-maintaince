import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestPreview = ({ 
  requestData, 
  isVisible, 
  onEdit, 
  onClose 
}) => {
  if (!isVisible) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRequestTypeLabel = (value) => {
    const types = {
      'preventive': 'Preventive Maintenance',
      'corrective': 'Corrective Maintenance',
      'emergency': 'Emergency Repair',
      'inspection': 'Safety Inspection',
      'upgrade': 'System Upgrade',
      'modification': 'Modification Work',
      'cleaning': 'Deep Cleaning',
      'calibration': 'Equipment Calibration'
    };
    return types?.[value] || value;
  };

  const getPriorityLevel = () => {
    if (!requestData?.requestedDate) return 'Normal';
    const selectedDate = new Date(requestData.requestedDate);
    const urgentDate = new Date();
    urgentDate?.setDate(urgentDate?.getDate() + 7);
    return selectedDate <= urgentDate ? 'Urgent' : 'Normal';
  };

  const priority = getPriorityLevel();

  return (
    <div className="fixed inset-0 bg-black/50 z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Request Preview</h2>
              <p className="text-sm text-muted-foreground">Review your maintenance request details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="w-8 h-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Type & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Settings" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Request Type</span>
              </div>
              <p className="text-sm text-foreground font-medium">
                {getRequestTypeLabel(requestData?.requestType)}
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Flag" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  priority === 'Urgent' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                }`}>
                  {priority}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Location</span>
              </div>
              <p className="text-sm text-foreground font-medium">
                {requestData?.location || 'Not specified'}
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Requested Date</span>
              </div>
              <p className="text-sm text-foreground font-medium">
                {formatDate(requestData?.requestedDate)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="FileText" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Description</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {requestData?.description || 'No description provided'}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {requestData?.description?.length || 0} characters
            </div>
          </div>

          {/* Attachments */}
          {requestData?.attachments && requestData?.attachments?.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Attachments ({requestData?.attachments?.length})
                </span>
              </div>
              <div className="space-y-2">
                {requestData?.attachments?.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-card rounded border">
                    <Icon name="File" size={16} className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file?.size / 1024 / 1024)?.toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Summary */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Request Summary</span>
            </div>
            <p className="text-sm text-foreground">
              {getRequestTypeLabel(requestData?.requestType)} request for {requestData?.location} 
              scheduled for {formatDate(requestData?.requestedDate)}. 
              {priority === 'Urgent' && ' This request has been marked as urgent due to the timeline.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
          >
            Edit Request
          </Button>
          <Button
            variant="default"
            onClick={onClose}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
          >
            Looks Good
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestPreview;