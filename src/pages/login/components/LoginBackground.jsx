import React from 'react';
import Image from '../../../components/AppImage';

const LoginBackground = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
          alt="Railway locomotive maintenance facility"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center p-12 text-white">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            Streamline Locomotive Maintenance Operations
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Comprehensive data management and request tracking system for railway maintenance teams across all zones and sheds.
          </p>
          
          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-white/90">Real-time maintenance request tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-white/90">Bulk data upload and management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-white/90">Location-based access control</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-white/90">Comprehensive data visualization</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">500+</div>
            <div className="text-sm text-white/80">Locomotives Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">50+</div>
            <div className="text-sm text-white/80">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">24/7</div>
            <div className="text-sm text-white/80">System Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBackground;