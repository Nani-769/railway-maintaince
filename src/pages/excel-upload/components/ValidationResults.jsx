import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationResults = ({ validationData, onDownloadErrorReport }) => {
  if (!validationData) return null;

  const { isValid, totalRows, validRows, errors, warnings } = validationData;

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'error':
        return <Icon name="XCircle" size={20} color="var(--color-error)" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />;
      default:
        return <Icon name="Info" size={20} color="var(--color-primary)" />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Validation Results</h3>
        {errors?.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadErrorReport}
            iconName="Download"
            iconPosition="left"
          >
            Download Error Report
          </Button>
        )}
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={24} color="var(--color-primary)" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRows}</p>
              <p className="text-sm text-muted-foreground">Total Rows</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-success/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            <div>
              <p className="text-2xl font-bold text-success">{validRows}</p>
              <p className="text-sm text-muted-foreground">Valid Rows</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-error/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="XCircle" size={24} color="var(--color-error)" />
            <div>
              <p className="text-2xl font-bold text-error">{errors?.length}</p>
              <p className="text-sm text-muted-foreground">Errors Found</p>
            </div>
          </div>
        </div>
      </div>
      {/* Overall Status */}
      <div className={`p-4 border rounded-lg mb-6 ${
        isValid 
          ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
      }`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon(isValid ? 'success' : 'error')}
          <div>
            <p className={`font-medium ${isValid ? 'text-success' : 'text-error'}`}>
              {isValid ? 'Validation Passed' : 'Validation Failed'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isValid 
                ? 'All data meets the required format and can be imported'
                : 'Please fix the errors below before proceeding with import'
              }
            </p>
          </div>
        </div>
      </div>
      {/* Error Details */}
      {errors?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Error Details</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {errors?.map((error, index) => (
              <div key={index} className={`p-3 border rounded-md ${getStatusColor(error?.type)}`}>
                <div className="flex items-start space-x-3">
                  {getStatusIcon(error?.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Row {error?.row}: {error?.column}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {error?.message}
                    </p>
                    {error?.value && (
                      <p className="text-xs mt-1 font-mono bg-black/10 px-2 py-1 rounded">
                        Current value: "{error?.value}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Warnings */}
      {warnings && warnings?.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-md font-medium text-foreground">Warnings</h4>
          <div className="space-y-2">
            {warnings?.map((warning, index) => (
              <div key={index} className={`p-3 border rounded-md ${getStatusColor('warning')}`}>
                <div className="flex items-start space-x-3">
                  {getStatusIcon('warning')}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Row {warning?.row}: {warning?.column}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {warning?.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Column Mapping Status */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Column Mapping Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {[
            'LOCO NO', 'ZONE', 'SHED NAME', 'UNIT SR NO', 'DOC', 'Out of Warranty',
            'LOCO TYPE', 'CONVERTER TYPE', 'DBR TYPE', 'Mother Board Modification',
            'Voltage Sensor Card', 'Buzzer Modification', 'PS Modification',
            'Flasher SW Modification', 'Sim Cards Changing Locos', 'SIM 1 No', 'SIM 2 No'
          ]?.map((column, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={12} color="var(--color-success)" />
              <span className="text-muted-foreground truncate">{column}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;