import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  onSubmit, 
  onSaveDraft, 
  onCancel, 
  onPreview,
  isSubmitting, 
  isDraftSaving,
  isFormValid,
  hasChanges 
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
            className="flex-1 sm:flex-none"
            disabled={isSubmitting || isDraftSaving}
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            loading={isDraftSaving}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
            className="flex-1 sm:flex-none"
            disabled={isSubmitting || !hasChanges}
          >
            Save Draft
          </Button>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
            className="flex-1 sm:flex-none"
            disabled={!isFormValid || isSubmitting || isDraftSaving}
          >
            Preview
          </Button>
          
          <Button
            type="submit"
            variant="default"
            onClick={onSubmit}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
            className="flex-1 sm:flex-none"
            disabled={!isFormValid || isDraftSaving}
          >
            Submit Request
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        {hasChanges && (
          <div className="flex items-center space-x-1">
            <Icon name="Circle" size={8} className="text-warning fill-current" />
            <span>Unsaved changes</span>
          </div>
        )}
        
        {isFormValid && (
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} className="text-success" />
            <span>Form is valid</span>
          </div>
        )}
        
        {!isFormValid && (
          <div className="flex items-center space-x-1">
            <Icon name="AlertCircle" size={12} className="text-warning" />
            <span>Please complete required fields</span>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="p-3 bg-muted rounded-md">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Submission Guidelines:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>All required fields must be completed before submission</li>
              <li>Drafts are automatically saved to your account</li>
              <li>Urgent requests (within 7 days) receive priority processing</li>
              <li>You'll receive email confirmation once submitted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormActions;