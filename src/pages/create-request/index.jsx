import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RequestTypeSelect from './components/RequestTypeSelect';
import LocationField from './components/LocationField';
import DescriptionField from './components/DescriptionField';
import DatePicker from './components/DatePicker';
import FileAttachment from './components/FileAttachment';
import RequestPreview from './components/RequestPreview';
import FormActions from './components/FormActions';
import { requestService } from '../../services/requestService';
import { locomotiveService } from '../../services/locomotiveService';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [locomotives, setLocomotives] = useState([]);
  const [loadingLoco, setLoadingLoco] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    request_type: '',
    loco_id: '',
    location: userProfile?.location || '',
    title: '',
    description: '',
    priority: 'normal',
    requested_completion_date: '',
    attachments: []
  });

  const [isLocationOverride, setIsLocationOverride] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load locomotives
  useEffect(() => {
    const loadLocomotives = async () => {
      try {
        setLoadingLoco(true);
        const { data, error } = await locomotiveService?.getAllLocomotives();
        if (!error && data) {
          setLocomotives(data);
        }
      } catch (error) {
        console.error('Error loading locomotives:', error);
      } finally {
        setLoadingLoco(false);
      }
    };

    loadLocomotives();
  }, []);

  // Update location when userProfile loads
  useEffect(() => {
    if (userProfile?.location && !isLocationOverride) {
      setFormData(prev => ({
        ...prev,
        location: userProfile?.location
      }));
    }
  }, [userProfile, isLocationOverride]);

  // Track form changes
  useEffect(() => {
    const hasFormChanges = 
      formData?.request_type !== '' ||
      formData?.loco_id !== '' ||
      formData?.location !== (userProfile?.location || '') ||
      formData?.title !== '' ||
      formData?.description !== '' ||
      formData?.priority !== 'normal' ||
      formData?.requested_completion_date !== '' ||
      formData?.attachments?.length > 0;
    
    setHasChanges(hasFormChanges);
  }, [formData, userProfile]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.request_type) {
      newErrors.request_type = 'Please select a request type';
    }

    if (!formData?.loco_id) {
      newErrors.loco_id = 'Please select a locomotive';
    }

    if (!formData?.title || formData?.title?.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData?.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData?.description || formData?.description?.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData?.description && formData?.description?.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!formData?.requested_completion_date) {
      newErrors.requested_completion_date = 'Please select a requested completion date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isFormValid = () => {
    return formData?.request_type &&
           formData?.loco_id &&
           formData?.title &&
           formData?.title?.length >= 5 &&
           formData?.location &&
           formData?.description &&
           formData?.description?.length >= 20 &&
           formData?.description?.length <= 1000 &&
           formData?.requested_completion_date;
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLocationToggle = () => {
    setIsLocationOverride(!isLocationOverride);
    if (!isLocationOverride) {
      handleInputChange('location', '');
    } else {
      handleInputChange('location', userProfile?.location || '');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm() || !user?.id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await requestService?.createRequest(formData, user?.id);
      
      if (error) {
        setErrors({ submit: error?.message || 'Failed to submit request. Please try again.' });
        return;
      }

      setShowSuccessMessage(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/user-dashboard');
      }, 3000);

    } catch (error) {
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user?.id) return;
    
    setIsDraftSaving(true);
    
    try {
      const { data, error } = await requestService?.saveDraft(formData, user?.id);
      
      if (error) {
        setErrors({ draft: error?.message || 'Failed to save draft' });
        return;
      }

      // Show temporary success message
      const originalHasChanges = hasChanges;
      setHasChanges(false);
      setTimeout(() => setHasChanges(originalHasChanges), 2000);

    } catch (error) {
      setErrors({ draft: 'Failed to save draft' });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/user-dashboard');
  };

  const handleLogout = async () => {
    try {
      const { signOut } = useAuth();
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Loading state
  if (authLoading || loadingLoco) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    navigate('/login');
    return null;
  }

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal p-6 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Request Submitted Successfully!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your maintenance request has been submitted and assigned a tracking ID. 
          You will receive an email confirmation shortly.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-success">
          <Icon name="Clock" size={16} />
          <span>Redirecting to dashboard...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} onLogout={handleLogout} />
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={userProfile}
        onLogout={handleLogout}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Create Maintenance Request</h1>
                <p className="text-sm text-muted-foreground">
                  Submit a new maintenance request for locomotive services
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/user-dashboard')}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Create Request</span>
            </div>
          </div>

          {/* Main Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} className="text-muted-foreground" />
                  <h2 className="text-lg font-medium text-foreground">Request Details</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Please provide detailed information about your maintenance request
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Request Type */}
                <RequestTypeSelect
                  value={formData?.request_type}
                  onChange={(value) => handleInputChange('request_type', value)}
                  error={errors?.request_type}
                />

                {/* Locomotive Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Locomotive <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData?.loco_id}
                    onChange={(e) => handleInputChange('loco_id', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select locomotive...</option>
                    {locomotives?.map((loco) => (
                      <option key={loco?.id} value={loco?.id}>
                        {loco?.loco_number} - {loco?.model} ({loco?.current_location})
                      </option>
                    ))}
                  </select>
                  {errors?.loco_id && (
                    <p className="text-sm text-red-500">{errors?.loco_id}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Request Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData?.title}
                    onChange={(e) => handleInputChange('title', e?.target?.value)}
                    placeholder="Enter a brief title for your request"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={100}
                  />
                  {errors?.title && (
                    <p className="text-sm text-red-500">{errors?.title}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <select
                    value={formData?.priority}
                    onChange={(e) => handleInputChange('priority', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                {/* Location */}
                <LocationField
                  value={isLocationOverride ? formData?.location : userProfile?.location}
                  onChange={(value) => handleInputChange('location', value)}
                  error={errors?.location}
                  userLocation={userProfile?.location}
                  canOverride={true}
                  isOverriding={isLocationOverride}
                  onToggleOverride={handleLocationToggle}
                />

                {/* Description */}
                <DescriptionField
                  value={formData?.description}
                  onChange={(value) => handleInputChange('description', value)}
                  error={errors?.description}
                  maxLength={1000}
                />

                {/* Date Picker */}
                <DatePicker
                  value={formData?.requested_completion_date}
                  onChange={(value) => handleInputChange('requested_completion_date', value)}
                  error={errors?.requested_completion_date}
                />

                {/* File Attachment */}
                <FileAttachment
                  files={formData?.attachments}
                  onFilesChange={(files) => handleInputChange('attachments', files)}
                  error={errors?.attachments}
                />

                {/* Form Actions */}
                <FormActions
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveDraft}
                  onCancel={handleCancel}
                  onPreview={() => setShowPreview(true)}
                  isSubmitting={isSubmitting}
                  isDraftSaving={isDraftSaving}
                  isFormValid={isFormValid()}
                  hasChanges={hasChanges}
                />

                {/* Errors */}
                {errors?.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-red-500" />
                      <p className="text-sm text-red-700">{errors?.submit}</p>
                    </div>
                  </div>
                )}
                
                {errors?.draft && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-red-500" />
                      <p className="text-sm text-red-700">{errors?.draft}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      {/* Request Preview Modal */}
      <RequestPreview
        requestData={formData}
        isVisible={showPreview}
        onEdit={() => setShowPreview(false)}
        onClose={() => setShowPreview(false)}
      />
      {/* Success Message */}
      {showSuccessMessage && <SuccessMessage />}
    </div>
  );
};

export default CreateRequest;