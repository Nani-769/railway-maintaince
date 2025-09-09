import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ status, progress, message }) => {
  if (!status || status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: 'Loader2',
          color: 'var(--color-primary)',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success'
        };
      case 'error':
        return {
          icon: 'XCircle',
          color: 'var(--color-error)',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error'
        };
      default:
        return {
          icon: 'Info',
          color: 'var(--color-primary)',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-6 border rounded-lg ${config?.bgColor} ${config?.borderColor}`}>
      <div className="flex items-center space-x-4">
        <div className={`flex-shrink-0 ${status === 'processing' ? 'animate-spin' : ''}`}>
          <Icon name={config?.icon} size={24} color={config?.color} />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config?.textColor}`}>
            {status === 'processing' && 'Processing Upload...'}
            {status === 'success' && 'Upload Completed Successfully'}
            {status === 'error' && 'Upload Failed'}
          </h3>
          
          {message && (
            <p className="text-sm text-muted-foreground mt-1">
              {message}
            </p>
          )}
          
          {status === 'processing' && progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className={config?.textColor}>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {status === 'success' && (
        <div className="mt-4 p-3 bg-success/5 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-success">
            <Icon name="Database" size={16} />
            <span>Data has been successfully imported to the system</span>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-3 bg-error/5 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-error">
            <Icon name="AlertCircle" size={16} />
            <span>Please check the error details and try again</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingStatus;