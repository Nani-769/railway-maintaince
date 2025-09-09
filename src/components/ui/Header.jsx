import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, onLogout = () => {} }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'LayoutDashboard' },
    { label: 'My Requests', path: '/create-request', icon: 'Plus' },
    { label: 'Request Management', path: '/request-management', icon: 'ClipboardList', adminOnly: true },
    { label: 'Data Upload', path: '/excel-upload', icon: 'Upload', adminOnly: true },
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  const visibleItems = navigationItems?.filter(item => 
    !item?.adminOnly || (user?.role === 'admin')
  )?.slice(0, 4);

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Train" size={24} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">LocoTrack</h1>
            <span className="text-xs text-muted-foreground font-medium">Admin System</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {visibleItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActive(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="px-3 py-2"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {user?.role || 'User'} • {user?.location || 'All Zones'}
              </span>
            </div>
          )}
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              iconName="User"
              iconSize={18}
              className="w-10 h-10 rounded-full p-0"
            />
            
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-150" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 top-12 w-48 bg-popover border border-border rounded-md shadow-modal z-200 animate-fade-in">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/profile');
                      }}
                      iconName="Settings"
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start px-3 py-2"
                    >
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start px-3 py-2 text-error hover:text-error hover:bg-error/10"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;