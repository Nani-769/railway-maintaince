import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: 'admin@locotrack.com', password: 'admin123', role: 'admin' },
    user1: { email: 'user1@locotrack.com', password: 'user123', role: 'user' },
    user2: { email: 'user2@locotrack.com', password: 'user123', role: 'user' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check credentials
      const user = Object.values(mockCredentials)?.find(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );

      if (!user) {
        setErrors({ 
          general: 'Invalid email or password. Please check your credentials and try again.' 
        });
        return;
      }

      // Store user data in localStorage
      const userData = {
        email: user?.email,
        role: user?.role,
        name: user?.role === 'admin' ? 'Admin User' : 'Field User',
        location: user?.role === 'admin' ? 'All Zones' : 'Zone A',
        loginTime: new Date()?.toISOString()
      };
      
      localStorage.setItem('locotrack_user', JSON.stringify(userData));
      localStorage.setItem('locotrack_token', 'mock_jwt_token_' + Date.now());

      // Navigate based on role
      navigate('/user-dashboard');
      
    } catch (error) {
      setErrors({ 
        general: 'Login failed. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here.\n\nFor demo purposes, use these credentials:\nAdmin: admin@locotrack.com / admin123\nUser: user1@locotrack.com / user123');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg mx-auto mb-4">
            <Icon name="Train" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your LocoTrack account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-error/10 border border-error/20 rounded-md p-3 flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm text-error">{errors?.general}</span>
            </div>
          )}

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            
            <Button
              variant="link"
              size="sm"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-primary hover:text-primary/80 p-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName="LogIn"
            iconPosition="right"
            iconSize={18}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            >
              Register here
            </Button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Admin: admin@locotrack.com / admin123</div>
            <div>User: user1@locotrack.com / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;