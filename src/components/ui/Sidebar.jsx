import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isCollapsed = false, 
  onToggleCollapse = () => {}, 
  user = null, 
  onLogout = () => {},
  className = "" 
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/user-dashboard', 
      icon: 'LayoutDashboard',
      description: 'System overview and metrics'
    },
    { 
      label: 'Create Request', 
      path: '/create-request', 
      icon: 'Plus',
      description: 'Submit new maintenance request'
    },
    { 
      label: 'Request Management', 
      path: '/request-management', 
      icon: 'ClipboardList',
      description: 'Manage all maintenance requests',
      adminOnly: true
    },
    { 
      label: 'Data Upload', 
      path: '/excel-upload', 
      icon: 'Upload',
      description: 'Import bulk maintenance data',
      adminOnly: true
    },
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    setIsMobileOpen(false);
    onLogout();
  };

  const filteredItems = navigationItems?.filter(item => 
    !item?.adminOnly || (user?.role === 'admin')
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center p-4 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg flex-shrink-0">
          <Icon name="Train" size={24} color="white" />
        </div>
        {!isCollapsed && (
          <div className="ml-3 flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">LocoTrack</h1>
            <span className="text-xs text-muted-foreground font-medium">Admin System</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems?.map((item) => (
          <div key={item?.path} className="relative group">
            <Button
              variant={isActive(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={20}
              className={`w-full justify-start px-3 py-3 h-auto ${
                isCollapsed ? 'px-3' : 'px-4'
              }`}
            >
              {!isCollapsed && (
                <div className="flex flex-col items-start ml-2">
                  <span className="text-sm font-medium">{item?.label}</span>
                  <span className="text-xs text-muted-foreground">{item?.description}</span>
                </div>
              )}
            </Button>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-popover border border-border rounded-md shadow-modal opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-300 pointer-events-none">
                <div className="text-sm font-medium text-popover-foreground">{item?.label}</div>
                <div className="text-xs text-muted-foreground">{item?.description}</div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {user && !isCollapsed && (
          <div className="mb-3 p-3 bg-muted rounded-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role || 'User'} • {user?.location || 'All Zones'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            iconName="Settings"
            iconPosition="left"
            iconSize={18}
            className={`w-full justify-start px-3 py-2 ${
              isCollapsed ? 'px-3' : 'px-4'
            }`}
          >
            {!isCollapsed && 'Settings'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            iconName="LogOut"
            iconPosition="left"
            iconSize={18}
            className={`w-full justify-start px-3 py-2 text-error hover:text-error hover:bg-error/10 ${
              isCollapsed ? 'px-3' : 'px-4'
            }`}
          >
            {!isCollapsed && 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        iconName="Menu"
        iconSize={20}
        className="fixed top-4 left-4 z-200 md:hidden w-10 h-10 p-0"
      />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-full bg-card border-r border-border shadow-card z-100 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${className}`}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
          iconSize={16}
          className="absolute -right-3 top-6 w-6 h-6 p-0 bg-card border border-border rounded-full shadow-card"
        />
        
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-150 md:hidden" 
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border shadow-modal z-200 md:hidden animate-slide-in">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              iconName="X"
              iconSize={20}
              className="absolute right-4 top-4 w-8 h-8 p-0"
            />
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;