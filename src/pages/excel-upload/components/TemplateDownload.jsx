import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateDownload = () => {
  const requiredColumns = [
    { name: 'LOCO NO', description: 'Locomotive identification number' },
    { name: 'ZONE', description: 'Railway zone designation' },
    { name: 'SHED NAME', description: 'Maintenance shed location' },
    { name: 'UNIT SR NO', description: 'Unit serial number' },
    { name: 'DOC', description: 'Date of commissioning' },
    { name: 'Out of Warranty', description: 'Warranty status (Yes/No)' },
    { name: 'LOCO TYPE', description: 'Locomotive type classification' },
    { name: 'CONVERTER TYPE', description: 'Power converter specification' },
    { name: 'DBR TYPE', description: 'Dynamic brake resistor type' },
    { name: 'Mother Board Modification', description: 'Motherboard modification status' },
    { name: 'Voltage Sensor Card', description: 'Voltage sensor card details' },
    { name: 'Buzzer Modification', description: 'Buzzer modification status' },
    { name: 'PS Modification', description: 'Power supply modification status' },
    { name: 'Flasher SW Modification', description: 'Flasher software modification' },
    { name: 'Sim Cards Changing Locos', description: 'SIM card change requirements' },
    { name: 'SIM 1 No', description: 'Primary SIM card number' },
    { name: 'SIM 2 No', description: 'Secondary SIM card number' }
  ];

  const handleDownloadTemplate = () => {
    // Create CSV content with headers
    const headers = requiredColumns?.map(col => col?.name)?.join(',');
    const sampleData = [
      'WAG12345,CR,Mumbai Central,UC001,15/03/2020,No,WAG-12,IGBT,DBR-500,Modified,VSC-2023,Modified,Modified,V2.1,Required,9876543210,9876543211',
      'WAG12346,WR,Vadodara,UC002,22/07/2019,Yes,WAG-12,IGBT,DBR-500,Standard,VSC-2022,Standard,Modified,V2.0,Not Required,9876543212,9876543213'
    ]?.join('\n');
    
    const csvContent = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link?.setAttribute('href', url);
    link?.setAttribute('download', 'locomotive_data_template.csv');
    link.style.visibility = 'hidden';
    
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Data Template</h3>
          <p className="text-sm text-muted-foreground">
            Download the required template with all 17 columns for proper data formatting
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
          iconName="Download"
          iconPosition="left"
          className="flex-shrink-0"
        >
          Download Template
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {requiredColumns?.slice(0, 6)?.map((column, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium text-foreground">{column?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{column?.description}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronDown"
            iconPosition="right"
            className="text-primary hover:text-primary"
            onClick={() => {
              const element = document.getElementById('all-columns');
              element?.classList?.toggle('hidden');
            }}
          >
            View All 17 Columns
          </Button>
          
          <div id="all-columns" className="hidden mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {requiredColumns?.slice(6)?.map((column, index) => (
              <div key={index + 6} className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm font-medium text-foreground">{column?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{column?.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Important Notes:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• All 17 columns must be present in your Excel file</li>
                <li>• Column names must match exactly (case-sensitive)</li>
                <li>• Date format should be DD/MM/YYYY</li>
                <li>• Yes/No fields should contain only "Yes" or "No" values</li>
                <li>• SIM card numbers should be 10-digit mobile numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDownload;