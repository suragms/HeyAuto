import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Loader2 } from 'lucide-react';
import DriverLoginForm from './DriverLoginForm';
import DriverSignupForm from './DriverSignupForm';
import DriverPhoneLoginForm from './DriverPhoneLoginForm';

type DriverAuthMode = 'login' | 'register' | 'phone-login';

interface DriverAuthPageProps {
  initialMode?: DriverAuthMode;
}

const DriverAuthPage: React.FC<DriverAuthPageProps> = ({ initialMode = 'login' }) => {
  const [authMode, setAuthMode] = useState<DriverAuthMode>(initialMode);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useDriverAuth();

  console.log('DriverAuthPage: Rendering with authMode:', authMode, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated - handled by DriverRoutes component
  // This useEffect is kept for fallback but the main redirect is in DriverRoutes

  const handleAuthSuccess = () => {
    console.log('DriverAuthPage: handleAuthSuccess called');
    // The DriverRoutes component will handle the redirect automatically
    // when isAuthenticated becomes true
    navigate('/driver/dashboard');
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <DriverLoginForm
            onSwitchToRegister={() => setAuthMode('register')}
            onSwitchToPhoneLogin={() => setAuthMode('phone-login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'register':
        return (
          <DriverSignupForm
            onSwitchToLogin={() => setAuthMode('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'phone-login':
        return (
          <DriverPhoneLoginForm
            onSwitchToEmailLogin={() => setAuthMode('login')}
            onSwitchToRegister={() => setAuthMode('register')}
            onSuccess={handleAuthSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AutoNow</h1>
          <p className="text-slate-300">Driver Portal</p>
        </div>
        
        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          {renderAuthForm()}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Need help? Contact support at{' '}
            <a href="mailto:support@autonow.com" className="text-primary hover:text-primary/80 transition-colors">
              support@autonow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverAuthPage;
