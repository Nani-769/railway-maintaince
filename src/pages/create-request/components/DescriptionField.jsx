import React from 'react';
import Icon from '../../../components/AppIcon';

const DescriptionField = ({ value, onChange, error }) => {
  const maxLength = 500;
  const minLength = 20;
  const currentLength = value?.length;
  const isValid = currentLength >= minLength && currentLength <= maxLength;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Description <span className="text-error">*</span>
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          placeholder="Provide detailed description of the maintenance request including specific issues, symptoms, or requirements..."
          className={`w-full min-h-32 px-3 py-2 border rounded-md resize-y transition-colors ${
            error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : isValid 
                ? 'border-success focus:border-success focus:ring-success/20' :'border-border focus:border-ring focus:ring-ring/20'
          } focus:outline-none focus:ring-2`}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          {isValid && (
            <Icon name="CheckCircle" size={16} className="text-success" />
          )}
          <span className={`text-xs ${
            currentLength < minLength 
              ? 'text-warning' 
              : currentLength > maxLength * 0.9 
                ? 'text-error' :'text-muted-foreground'
          }`}>
            {currentLength}/{maxLength}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Minimum {minLength} characters required for detailed description
        </p>
        {currentLength < minLength && (
          <p className="text-xs text-warning">
            {minLength - currentLength} more characters needed
          </p>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default DescriptionField;