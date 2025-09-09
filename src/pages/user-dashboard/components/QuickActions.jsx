import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create New Request",
      description: "Submit a new maintenance request",
      icon: "Plus",
      variant: "default",
      onClick: () => navigate('/create-request')
    },
    {
      title: "My Requests",
      description: "View and track your requests",
      icon: "ClipboardList",
      variant: "outline",
      onClick: () => navigate('/create-request')
    },
    {
      title: "Request History",
      description: "Browse completed requests",
      icon: "History",
      variant: "outline",
      onClick: () => navigate('/create-request')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <div key={index} className="group">
            <Button
              variant={action?.variant}
              onClick={action?.onClick}
              iconName={action?.icon}
              iconPosition="left"
              className="w-full h-auto p-4 flex-col items-start text-left group-hover:shadow-md transition-shadow"
            >
              <div className="flex items-center w-full mb-2">
                <span className="font-medium">{action?.title}</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                {action?.description}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;