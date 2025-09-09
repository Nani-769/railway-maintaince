import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import RequestFilters from './components/RequestFilters';
import RequestTable from './components/RequestTable';
import RequestDetailsModal from './components/RequestDetailsModal';
import RequestAnalytics from './components/RequestAnalytics';
import Icon from '../../components/AppIcon';
import { requestService } from '../../services/requestService';

const RequestManagement = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    assignedTo: 'all',
    location: '',
    fromDate: '',
    toDate: ''
  });

  // Add missing state for table functionality
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRequests, setSelectedRequests] = useState([]);

  // Check if user has admin/supervisor access
  const isAdminOrSupervisor = userProfile?.role === 'admin' || userProfile?.role === 'supervisor';

  // Load requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        let result;
        if (isAdminOrSupervisor) {
          result = await requestService?.getAllRequests(filters);
        } else {
          result = await requestService?.getUserRequests(user?.id, filters);
        }

        if (result?.error) {
          console.error('Error loading requests:', result?.error);
          return;
        }

        setRequests(result?.data || []);
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [user?.id, isAdminOrSupervisor, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Add missing handler functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedRequests(selectedIds);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting requests...');
  };

  const handleAssignUser = async (requestId, userId) => {
    try {
      const { data, error } = await requestService?.updateRequest(requestId, {
        assigned_to: userId,
        assigned_at: new Date()?.toISOString()
      });

      if (error) {
        console.error('Error assigning user:', error);
        return;
      }

      // Update local state
      setRequests(prev => 
        prev?.map(req => 
          req?.id === requestId ? { ...req, ...data } : req
        )
      );

      // Update selected request if it's the one being updated
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(data);
      }
    } catch (error) {
      console.error('Error assigning user:', error);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const { data, error } = await requestService?.updateRequest(requestId, {
        request_status: newStatus,
        ...(newStatus === 'approved' && { approved_at: new Date()?.toISOString() }),
        ...(newStatus === 'in_progress' && { started_at: new Date()?.toISOString() }),
        ...(newStatus === 'completed' && { completed_at: new Date()?.toISOString() })
      });

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Update local state
      setRequests(prev => 
        prev?.map(req => 
          req?.id === requestId ? { ...req, ...data } : req
        )
      );

      // Update selected request if it's the one being updated
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(data);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
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
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading requests...</span>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    navigate('/login');
    return null;
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="List" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Request Management</h1>
                <p className="text-sm text-muted-foreground">
                  {isAdminOrSupervisor 
                    ? 'Manage all maintenance requests across the system' :'View and track your maintenance requests'
                  }
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/create-request')}
                className="flex items-center space-x-2"
              >
                <Icon name="Plus" size={16} />
                <span>New Request</span>
              </Button>
            </div>
          </div>

          {/* Analytics */}
          {isAdminOrSupervisor && (
            <RequestAnalytics requests={requests} className="mb-6" />
          )}

          {/* Filters */}
          <RequestFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            isAdminOrSupervisor={isAdminOrSupervisor}
            className="mb-6"
          />

          {/* Requests Table */}
          <RequestTable
            requests={requests}
            onRequestClick={handleRequestClick}
            onStatusUpdate={isAdminOrSupervisor ? handleStatusUpdate : null}
            onSelectionChange={handleSelectionChange}
            onViewDetails={handleViewDetails}
            onExport={handleExport}
            sortConfig={sortConfig}
            onSort={handleSort}
            isAdminView={isAdminOrSupervisor}
            loading={loading}
          />

          {/* Request Details Modal */}
          {showRequestModal && selectedRequest && (
            <RequestDetailsModal
              request={selectedRequest}
              isOpen={showRequestModal}
              onClose={() => {
                setShowRequestModal(false);
                setSelectedRequest(null);
              }}
              onStatusUpdate={isAdminOrSupervisor ? handleStatusUpdate : null}
              onAssignUser={isAdminOrSupervisor ? handleAssignUser : null}
              isAdminView={isAdminOrSupervisor}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestManagement;