import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import FileUploadZone from './components/FileUploadZone';
import TemplateDownload from './components/TemplateDownload';
import ValidationResults from './components/ValidationResults';
import DataPreview from './components/DataPreview';
import ProcessingStatus from './components/ProcessingStatus';

const ExcelUpload = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Admin User",
    email: "admin@locotrack.com",
    role: "admin",
    location: "All Zones"
  };

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setValidationData(null);
    setPreviewData(null);
    setProcessingStatus('idle');
    
    // Simulate file validation
    setTimeout(() => {
      validateFile(file);
    }, 1000);
  };

  const validateFile = (file) => {
    // Mock validation logic
    const mockValidation = {
      isValid: true,
      totalRows: 150,
      validRows: 148,
      errors: [
        {
          row: 45,
          column: 'SIM 1 No',
          message: 'Invalid mobile number format. Must be 10 digits.',
          value: '98765432',
          type: 'error'
        },
        {
          row: 78,
          column: 'DOC',
          message: 'Invalid date format. Expected DD/MM/YYYY.',
          value: '2020-03-15',
          type: 'error'
        }
      ],
      warnings: [
        {
          row: 23,
          column: 'Out of Warranty',
          message: 'Unusual warranty status for recent locomotive.',
          type: 'warning'
        }
      ]
    };

    // For demo, sometimes show validation errors
    if (file?.name?.includes('error')) {
      mockValidation.isValid = false;
      mockValidation.validRows = 145;
      mockValidation?.errors?.push({
        row: 12,
        column: 'LOCO NO',
        message: 'Duplicate locomotive number found.',
        value: 'WAG12345',
        type: 'error'
      });
    }

    setValidationData(mockValidation);

    // If validation passes, generate preview data
    if (mockValidation?.isValid) {
      generatePreviewData();
    }
  };

  const generatePreviewData = () => {
    // Mock preview data
    const mockData = Array.from({ length: 150 }, (_, index) => ({
      LOCO_NO: `WAG${12345 + index}`,
      ZONE: ['CR', 'WR', 'NR', 'SR', 'ER']?.[index % 5],
      SHED_NAME: ['Mumbai Central', 'Vadodara', 'New Delhi', 'Chennai', 'Kolkata']?.[index % 5],
      UNIT_SR_NO: `UC${String(index + 1)?.padStart(3, '0')}`,
      DOC: `${String(Math.floor(Math.random() * 28) + 1)?.padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1)?.padStart(2, '0')}/${2018 + Math.floor(Math.random() * 6)}`,
      OUT_OF_WARRANTY: Math.random() > 0.7 ? 'Yes' : 'No',
      LOCO_TYPE: ['WAG-12', 'WAG-9', 'WDG-4']?.[index % 3],
      CONVERTER_TYPE: ['IGBT', 'GTO', 'MOSFET']?.[index % 3],
      DBR_TYPE: ['DBR-500', 'DBR-750', 'DBR-1000']?.[index % 3],
      MOTHER_BOARD_MOD: Math.random() > 0.5 ? 'Modified' : 'Standard',
      VOLTAGE_SENSOR: `VSC-${2020 + Math.floor(Math.random() * 4)}`,
      BUZZER_MOD: Math.random() > 0.6 ? 'Modified' : 'Standard',
      PS_MOD: Math.random() > 0.4 ? 'Modified' : 'Standard',
      FLASHER_SW_MOD: `V${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      SIM_CHANGING: Math.random() > 0.8 ? 'Required' : 'Not Required',
      SIM_1_NO: `987654${String(3210 + index)?.slice(-4)}`,
      SIM_2_NO: `987654${String(3211 + index)?.slice(-4)}`
    }));

    setPreviewData(mockData);
  };

  const handleProcessUpload = () => {
    setProcessingStatus('processing');
    setProcessingProgress(0);
    setProcessingMessage('Validating data integrity...');

    // Simulate processing steps
    const steps = [
      { progress: 20, message: 'Parsing Excel file...' },
      { progress: 40, message: 'Validating locomotive data...' },
      { progress: 60, message: 'Checking for duplicates...' },
      { progress: 80, message: 'Importing to database...' },
      { progress: 100, message: 'Upload completed successfully!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps?.length) {
        setProcessingProgress(steps?.[currentStep]?.progress);
        setProcessingMessage(steps?.[currentStep]?.message);
        currentStep++;
      } else {
        clearInterval(interval);
        setProcessingStatus('success');
        setProcessingMessage('150 locomotive records have been successfully imported to the system.');
      }
    }, 1500);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setValidationData(null);
    setPreviewData(null);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setProcessingMessage('');
  };

  const handleDownloadErrorReport = () => {
    if (!validationData || !validationData?.errors?.length) return;

    const errorReport = [
      'Row,Column,Error Type,Message,Current Value',
      ...validationData?.errors?.map(error => 
        `${error?.row},"${error?.column}","${error?.type}","${error?.message}","${error?.value || ''}"`
      )
    ]?.join('\n');

    const blob = new Blob([errorReport], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link?.setAttribute('href', url);
    link?.setAttribute('download', 'validation_errors.csv');
    link.style.visibility = 'hidden';
    
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onLogout={handleLogout} />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={mockUser}
        onLogout={handleLogout}
      />
      
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Upload" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Excel Upload</h1>
                <p className="text-muted-foreground">Import bulk locomotive maintenance data</p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Admin</span>
              <Icon name="ChevronRight" size={16} />
              <span>Data Management</span>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Excel Upload</span>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mb-6 flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleClearFile}
                iconName="X"
                iconPosition="left"
                disabled={processingStatus === 'processing'}
              >
                Clear File
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/request-management')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Management
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {/* Processing Status */}
            <ProcessingStatus
              status={processingStatus}
              progress={processingProgress}
              message={processingMessage}
            />

            {/* File Upload Zone */}
            <FileUploadZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              isProcessing={processingStatus === 'processing'}
            />

            {/* Template Download */}
            <TemplateDownload />

            {/* Validation Results */}
            {validationData && (
              <ValidationResults
                validationData={validationData}
                onDownloadErrorReport={handleDownloadErrorReport}
              />
            )}

            {/* Data Preview */}
            {previewData && validationData?.isValid && (
              <DataPreview
                previewData={previewData}
                onProcessUpload={handleProcessUpload}
                isProcessing={processingStatus === 'processing'}
              />
            )}

            {/* Help Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Icon name="FileText" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">File Format</p>
                    <p className="text-xs text-muted-foreground">
                      Use the provided template with all 17 required columns
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Data Validation</p>
                    <p className="text-xs text-muted-foreground">
                      All data is validated before import to ensure accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="Clock" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Processing Time</p>
                    <p className="text-xs text-muted-foreground">
                      Large files may take several minutes to process
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Error Handling</p>
                    <p className="text-xs text-muted-foreground">
                      Download error reports to fix data issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExcelUpload;