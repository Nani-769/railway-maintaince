import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import FilterPanel from './components/FilterPanel';
import RequestChart from './components/RequestChart';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import LocationSummary from './components/LocationSummary';
import { requestService } from '../../services/requestService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: '2025-01-01',
    toDate: '2025-09-09',
    requestType: 'all',
    status: 'all'
  });

  // Data state
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      total: 0,
      pending: 0,
      approved: 0,
      inProgress: 0,
      completed: 0,
      rejected: 0,
      critical: 0,
      high: 0
    },
    requests: [],
    activities: [],
    chartData: []
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Load metrics
        const { data: metrics, error: metricsError } = await requestService?.getDashboardMetrics(
          user?.id, 
          userProfile?.role === 'admin' || userProfile?.role === 'supervisor'
        );

        if (metricsError) {
          console.error('Error loading metrics:', metricsError);
          return;
        }

        // Load user requests
        const { data: requests, error: requestsError } = await requestService?.getUserRequests(user?.id, filters);

        if (requestsError) {
          console.error('Error loading requests:', requestsError);
          return;
        }

        // Process chart data
        const chartData = processChartData(requests || []);

        // Process activities from requests
        const activities = processActivities(requests || []);

        setDashboardData({
          metrics: metrics || {
            total: 0,
            pending: 0,
            approved: 0,
            inProgress: 0,
            completed: 0,
            rejected: 0,
            critical: 0,
            high: 0
          },
          requests: requests || [],
          activities: activities?.slice(0, 10), // Latest 10 activities
          chartData
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, userProfile?.role, filters]);

  const processChartData = (requests) => {
    const monthData = {};
    
    requests?.forEach(request => {
      const month = new Date(request?.created_at)?.toLocaleDateString('en-US', { month: 'short' });
      if (!monthData?.[month]) {
        monthData[month] = { name: month, submitted: 0, completed: 0, pending: 0 };
      }
      
      monthData[month].submitted += 1;
      
      if (request?.request_status === 'completed') {
        monthData[month].completed += 1;
      } else if (['pending', 'approved', 'in_progress']?.includes(request?.request_status)) {
        monthData[month].pending += 1;
      }
    });

    return Object.values(monthData)?.slice(-6); // Last 6 months
  };

  const processActivities = (requests) => {
    const activities = [];
    
    requests?.forEach(request => {
      // Add request creation activity
      activities?.push({
        id: `created-${request?.id}`,
        type: 'request_created',
        title: 'New Request Submitted',
        description: `${request?.title}`,
        status: request?.request_status,
        requestId: request?.request_id,
        timestamp: new Date(request?.created_at)
      });

      // Add status update activities if updated
      if (request?.submitted_at && request?.submitted_at !== request?.created_at) {
        activities?.push({
          id: `submitted-${request?.id}`,
          type: 'status_updated',
          title: 'Request Submitted',
          description: `Request ${request?.request_id} submitted for approval`,
          status: 'pending',
          requestId: request?.request_id,
          timestamp: new Date(request?.submitted_at)
        });
      }

      if (request?.approved_at) {
        activities?.push({
          id: `approved-${request?.id}`,
          type: 'status_updated',
          title: 'Request Approved',
          description: `Request ${request?.request_id} approved for work`,
          status: 'approved',
          requestId: request?.request_id,
          timestamp: new Date(request?.approved_at)
        });
      }

      if (request?.completed_at) {
        activities?.push({
          id: `completed-${request?.id}`,
          type: 'request_completed',
          title: 'Request Completed',
          description: `Request ${request?.request_id} has been completed`,
          status: 'completed',
          requestId: request?.request_id,
          timestamp: new Date(request?.completed_at)
        });
      }
    });

    return activities?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    // Filters will be applied automatically through useEffect
    console.log('Applying filters:', filters);
  };

  const handleResetFilters = () => {
    setFilters({
      fromDate: '2025-01-01',
      toDate: '2025-09-09',
      requestType: 'all',
      status: 'all'
    });
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
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    navigate('/login');
    return null;
  }

  // Metrics data for cards
  const metricsData = [
    {
      title: "Total Requests",
      value: dashboardData?.metrics?.total?.toString() || "0",
      icon: "ClipboardList",
      color: "primary",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Pending Requests", 
      value: dashboardData?.metrics?.pending?.toString() || "0",
      icon: "Clock",
      color: "warning",
      trend: "down",
      trendValue: "-5%"
    },
    {
      title: "Completed Requests",
      value: dashboardData?.metrics?.completed?.toString() || "0", 
      icon: "CheckCircle",
      color: "success",
      trend: "up",
      trendValue: "+18%"
    },
    {
      title: "In Progress",
      value: dashboardData?.metrics?.inProgress?.toString() || "0",
      icon: "Wrench", 
      color: "info",
      trend: "up",
      trendValue: "+8%"
    }
  ];

  // Status distribution data
  const statusDistributionData = [
    { name: 'Completed', value: dashboardData?.metrics?.completed || 0 },
    { name: 'Pending', value: dashboardData?.metrics?.pending || 0 },
    { name: 'In Progress', value: dashboardData?.metrics?.inProgress || 0 },
    { name: 'Approved', value: dashboardData?.metrics?.approved || 0 }
  ];

  // Location stats
  const locationStats = {
    userLocation: userProfile?.location || 'Unknown',
    totalRequests: dashboardData?.metrics?.total || 0,
    pendingRequests: dashboardData?.metrics?.pending || 0,
    completedRequests: dashboardData?.metrics?.completed || 0
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} onLogout={handleLogout} />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={userProfile}
        onLogout={handleLogout}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      } pt-16`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {userProfile?.full_name || user?.email}. Here is your maintenance overview.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
              Last updated: {new Date()?.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Location Summary */}
          <LocationSummary 
            userLocation={locationStats?.userLocation}
            locationStats={locationStats}
          />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                icon={metric?.icon}
                color={metric?.color}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
              />
            ))}
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RequestChart
              data={dashboardData?.chartData}
              type="bar"
              title="Monthly Request Trends"
            />
            <RequestChart
              data={statusDistributionData}
              type="pie"
              title="Request Status Distribution"
            />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Activity Feed */}
          <ActivityFeed activities={dashboardData?.activities} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;