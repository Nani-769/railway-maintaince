import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DatePicker = ({ value, onChange, error }) => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  const maxDate = new Date();
  maxDate?.setMonth(maxDate?.getMonth() + 6);
  const maxDateString = maxDate?.toISOString()?.split('T')?.[0];

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isUrgent = () => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const urgentDate = new Date();
    urgentDate?.setDate(urgentDate?.getDate() + 7);
    return selectedDate <= urgentDate;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <label className="text-sm font-medium text-foreground">
          Requested Completion Date <span className="text-error">*</span>
        </label>
        {isUrgent() && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-md">
            <Icon name="Clock" size={12} />
            <span className="text-xs font-medium">Urgent</span>
          </div>
        )}
      </div>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
        min={today}
        max={maxDateString}
        error={error}
        description={`Select date between today and ${formatDisplayDate(maxDateString)}`}
        required
      />
      {value && (
        <div className="mt-2 p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-foreground">
              Scheduled for: <strong>{formatDisplayDate(value)}</strong>
            </span>
          </div>
          {isUrgent() && (
            <p className="text-xs text-warning mt-1">
              This request is marked as urgent due to the short timeline. Priority processing will be applied.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;