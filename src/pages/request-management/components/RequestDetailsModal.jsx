import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RequestDetailsModal = ({ 
  request, 
  isOpen, 
  onClose, 
  onStatusUpdate, 
  onAssignUser 
}) => {
  const [comment, setComment] = useState('');
  const [assignedUser, setAssignedUser] = useState(request?.assignedTo || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !request) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const userOptions = [
    { value: '', label: 'Unassigned' },
    { value: 'john-doe', label: 'John Doe - Senior Technician' },
    { value: 'jane-smith', label: 'Jane Smith - Maintenance Engineer' },
    { value: 'mike-johnson', label: 'Mike Johnson - Field Supervisor' },
    { value: 'sarah-wilson', label: 'Sarah Wilson - Technical Lead' },
    { value: 'david-brown', label: 'David Brown - Maintenance Specialist' }
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config?.bg} ${config?.text} ${config?.border}`}>
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config?.bg} ${config?.text} ${config?.border}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!comment?.trim() && (newStatus === 'rejected' || newStatus === 'completed')) {
      alert('Please add a comment for this status change.');
      return;
    }
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(request?.id, newStatus, comment);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignUser = async () => {
    setIsUpdating(true);
    try {
      await onAssignUser(request?.id, assignedUser);
      onClose();
    } catch (error) {
      console.error('Failed to assign user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-150" 
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="ClipboardList" size={24} className="text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Request Details</h2>
                <p className="text-sm text-muted-foreground">ID: {request?.id}</p>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{request?.location}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Request Type</label>
                  <span className="text-sm text-foreground">{request?.requestType}</span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                  {getPriorityBadge(request?.priority)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Current Status</label>
                  {getStatusBadge(request?.status)}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Submitted Date</label>
                  <span className="text-sm text-foreground">{formatDate(request?.submittedDate)}</span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Submitted By</label>
                  <span className="text-sm text-foreground">{request?.submittedBy}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
              <div className="bg-muted/30 rounded-md p-4 border border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap">{request?.description}</p>
              </div>
            </div>

            {/* Timeline */}
            {request?.timeline && request?.timeline?.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Timeline</label>
                <div className="space-y-3">
                  {request?.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-md border border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{event?.action}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(event?.timestamp)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event?.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {event?.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment Section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Assignment & Status Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Assign to User"
                  options={userOptions}
                  value={assignedUser}
                  onChange={setAssignedUser}
                  placeholder="Select user"
                />
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleAssignUser}
                    loading={isUpdating}
                    iconName="UserPlus"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full"
                  >
                    Update Assignment
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Status Update</h3>
              
              <div className="space-y-4">
                <Input
                  label="Comment (required for rejection/completion)"
                  type="text"
                  placeholder="Add a comment about this status change..."
                  value={comment}
                  onChange={(e) => setComment(e?.target?.value)}
                  description="Comments are mandatory for rejection and completion"
                />
                
                <div className="flex flex-wrap gap-2">
                  {statusOptions?.map((status) => (
                    <Button
                      key={status?.value}
                      variant={request?.status === status?.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusUpdate(status?.value)}
                      loading={isUpdating}
                      disabled={request?.status === status?.value}
                    >
                      {status?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => window.print()}
              iconName="Printer"
              iconPosition="left"
              iconSize={16}
            >
              Print Details
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailsModal;