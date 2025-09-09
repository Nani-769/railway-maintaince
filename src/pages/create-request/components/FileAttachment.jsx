import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileAttachment = ({ files, onFilesChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

  const validateFile = (file) => {
    if (!allowedTypes?.includes(file?.type)) {
      return 'File type not supported. Please use images, PDF, or document files.';
    }
    if (file?.size > maxFileSize) {
      return 'File size too large. Maximum 10MB allowed.';
    }
    return null;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const errors = [];

    if (files?.length + fileArray?.length > maxFiles) {
      errors?.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray?.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors?.push(`${file?.name}: ${error}`);
      } else {
        validFiles?.push({
          id: Date.now() + Math.random(),
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type
        });
      }
    });

    if (errors?.length > 0) {
      console.error('File validation errors:', errors);
    }

    if (validFiles?.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    handleFiles(e?.dataTransfer?.files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e?.target?.files);
    e.target.value = '';
  };

  const removeFile = (fileId) => {
    onFilesChange(files?.filter(f => f?.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    if (type?.includes('word')) return 'FileText';
    return 'File';
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Supporting Documents
      </label>
      <p className="text-xs text-muted-foreground mb-3">
        Attach images, documents, or reports related to your maintenance request (Max 5 files, 10MB each)
      </p>
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : error
              ? 'border-error bg-error/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Upload" size={24} />
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FolderOpen"
            iconPosition="left"
            iconSize={16}
          >
            Browse Files
          </Button>
        </div>
      </div>
      {/* File List */}
      {files?.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Attached Files ({files?.length}/{maxFiles})
          </p>
          {files?.map((fileItem) => (
            <div
              key={fileItem?.id}
              className="flex items-center justify-between p-3 bg-muted rounded-md"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getFileIcon(fileItem?.type)} 
                  size={20} 
                  className="text-muted-foreground" 
                />
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-48">
                    {fileItem?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileItem?.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileItem?.id)}
                iconName="X"
                iconSize={16}
                className="text-error hover:text-error hover:bg-error/10"
              />
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FileAttachment;