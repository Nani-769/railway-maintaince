import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'approved':
        return 'text-primary bg-primary/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'rejected':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'request_created':
        return 'Plus';
      case 'status_updated':
        return 'RefreshCw';
      case 'request_approved':
        return 'CheckCircle';
      case 'request_completed':
        return 'CheckCircle2';
      case 'request_rejected':
        return 'XCircle';
      default:
        return 'Activity';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity?.status)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity?.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatDate(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity?.description}
                </p>
                
                {activity?.requestId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Request ID: {activity?.requestId}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;