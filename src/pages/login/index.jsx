import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './components/LoginForm';
import LoginBackground from './components/LoginBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/user-dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error?.message || 'Login failed. Please try again.');
        return;
      }

      if (data?.user) {
        navigate('/user-dashboard');
      }
    } catch (error) {
      setError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    {
      role: 'Admin',
      email: 'admin@railway.gov.in',
      password: 'admin123',
      description: 'Full system access'
    },
    {
      role: 'Supervisor',
      email: 'supervisor@railway.gov.in',
      password: 'supervisor123',
      description: 'Request approval & management'
    },
    {
      role: 'Technician',
      email: 'technician@railway.gov.in',
      password: 'technician123',
      description: 'Assigned request handling'
    },
    {
      role: 'User',
      email: 'user@railway.gov.in', 
      password: 'user123',
      description: 'Create & track requests'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="min-h-screen flex">
      {/* Background Section */}
      <div className="hidden lg:flex lg:w-1/2">
        <LoginBackground />
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Railway Maintenance System
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage locomotive maintenance requests
            </p>
          </div>

          {/* Login Form */}
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* Demo Credentials */}
          {showDemoCredentials && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">Demo Credentials</h3>
                <button
                  onClick={() => setShowDemoCredentials(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Hide
                </button>
              </div>
              <div className="space-y-3">
                {demoCredentials?.map((cred, index) => (
                  <div key={index} className="border border-border rounded-md p-3 bg-background">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-primary">{cred?.role}</span>
                      <span className="text-xs text-muted-foreground">{cred?.description}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-foreground font-mono">{cred?.email}</span>
                          <button
                            onClick={() => copyToClipboard(cred?.email)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Copy email"
                          >
                            📋
                          </button>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-foreground font-mono">Password: {cred?.password}</span>
                          <button
                            onClick={() => copyToClipboard(cred?.password)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Copy password"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLogin(cred?.email, cred?.password)}
                        className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        Quick Login
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Click any credential to copy, or use Quick Login for instant access
              </p>
            </div>
          )}
          
          {!showDemoCredentials && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDemoCredentials(true)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Show Demo Credentials
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Indian Railways - Locomotive Management System</p>
            <p className="mt-1">Secure access for authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;