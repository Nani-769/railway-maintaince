import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const RequestAnalytics = ({ 
  analyticsData = {
    statusDistribution: [],
    locationMetrics: [],
    processingTimes: [],
    monthlyTrends: []
  },
  isVisible = true 
}) => {
  if (!isVisible) return null;

  const COLORS = {
    pending: '#F59E0B',
    approved: '#1E3A8A', 
    completed: '#059669',
    rejected: '#DC2626'
  };

  const statusData = [
    { name: 'Pending', value: 45, color: COLORS?.pending },
    { name: 'Approved', value: 23, color: COLORS?.approved },
    { name: 'Completed', value: 67, color: COLORS?.completed },
    { name: 'Rejected', value: 12, color: COLORS?.rejected }
  ];

  const locationData = [
    { location: 'Mumbai Central', requests: 34, avgTime: 4.2 },
    { location: 'Delhi Junction', requests: 28, avgTime: 3.8 },
    { location: 'Chennai Central', requests: 25, avgTime: 5.1 },
    { location: 'Kolkata Howrah', requests: 22, avgTime: 4.7 },
    { location: 'Bangalore City', requests: 19, avgTime: 3.9 },
    { location: 'Hyderabad Deccan', requests: 15, avgTime: 4.3 }
  ];

  const monthlyData = [
    { month: 'Jan', requests: 45, completed: 38 },
    { month: 'Feb', requests: 52, completed: 44 },
    { month: 'Mar', requests: 48, completed: 41 },
    { month: 'Apr', requests: 61, completed: 53 },
    { month: 'May', requests: 55, completed: 48 },
    { month: 'Jun', requests: 67, completed: 58 }
  ];

  const processingTimeData = [
    { type: 'Routine Maintenance', avgDays: 3.2, count: 45 },
    { type: 'Emergency Repair', avgDays: 1.1, count: 23 },
    { type: 'Inspection', avgDays: 2.8, count: 34 },
    { type: 'Upgrade', avgDays: 7.5, count: 12 },
    { type: 'Replacement', avgDays: 5.3, count: 18 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md shadow-modal p-3">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Request Analytics</h2>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Last updated: {new Date()?.toLocaleDateString('en-GB')}</span>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold text-foreground">147</p>
            </div>
            <Icon name="ClipboardList" size={24} className="text-primary" />
          </div>
          <p className="text-xs text-success mt-2">+12% from last month</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Processing Time</p>
              <p className="text-2xl font-bold text-foreground">3.8 days</p>
            </div>
            <Icon name="Clock" size={24} className="text-warning" />
          </div>
          <p className="text-xs text-success mt-2">-0.5 days improvement</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">78%</p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <p className="text-xs text-success mt-2">+5% from last month</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Locations</p>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
            <Icon name="MapPin" size={24} className="text-accent" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Across all zones</p>
        </div>
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData?.map((entry) => (
              <div key={entry?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-xs text-foreground">{entry?.name}: {entry?.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Performance Bar Chart */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Requests by Location</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="location" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="requests" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Line Chart */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  name="Total Requests"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Time by Type */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Avg Processing Time by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processingTimeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="type" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgDays" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">89%</p>
            <p className="text-sm text-muted-foreground">On-time completion rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">2.1 days</p>
            <p className="text-sm text-muted-foreground">Avg response time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">94%</p>
            <p className="text-sm text-muted-foreground">User satisfaction rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAnalytics;