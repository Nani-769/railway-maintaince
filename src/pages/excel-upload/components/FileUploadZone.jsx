import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, selectedFile, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const fileExtension = file?.name?.toLowerCase()?.split('.')?.pop();
    const isValidType = allowedTypes?.some(type => 
      file?.type === type || fileExtension === 'xlsx' || fileExtension === 'xls'
    );
    
    if (!isValidType) {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    if (file?.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    onFileSelect(file);
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Upload Locomotive Data</h3>
        <p className="text-sm text-muted-foreground">
          Import bulk locomotive maintenance data using Excel files
        </p>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : selectedFile
            ? 'border-success bg-success/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-success/10 rounded-full">
              <Icon name="FileSpreadsheet" size={32} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{selectedFile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile?.size)} • Excel File
              </p>
              <p className="text-sm text-success mt-2">
                <Icon name="CheckCircle" size={16} className="inline mr-1" />
                File selected successfully
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-muted rounded-full">
              <Icon name="Upload" size={32} color="var(--color-muted-foreground)" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drag and drop your Excel file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse and select a file
              </p>
              <Button
                variant="outline"
                onClick={handleBrowseClick}
                iconName="FolderOpen"
                iconPosition="left"
                disabled={isProcessing}
              >
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">File Requirements:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Supported formats: .xlsx, .xls</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Must contain all 17 required columns</li>
          <li>• First row should contain column headers</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadZone;