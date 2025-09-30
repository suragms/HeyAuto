import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BackupLoginForm from './BackupLoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import BackupRecovery from './BackupRecovery';

/**
 * Authentication mode types
 * @type AuthMode
 */
type AuthMode = 'login' | 'register' | 'backup' | 'forgot-password' | 'recovery';

/**
 * Main authentication page component that handles multiple authentication modes
 * 
 * @component
 * @returns {JSX.Element} The authentication page component
 * 
 * @example
 * ```tsx
 * <AuthPage />
 * ```
 */
const AuthPage: React.FC = () => {
  /** Current authentication mode */
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  /** Navigation hook */
  const navigate = useNavigate();
  /** Authentication context */
  const { isAuthenticated, isLoading } = useAuth();

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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm 
            onSwitchToRegister={() => setAuthMode('register')}
            onSwitchToBackup={() => setAuthMode('backup')}
            onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
            onSwitchToRecovery={() => setAuthMode('recovery')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onSwitchToLogin={() => setAuthMode('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'backup':
        return (
          <BackupLoginForm 
            onSwitchToRegister={() => setAuthMode('register')}
            onBackToEmail={() => setAuthMode('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onBackToLogin={() => setAuthMode('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'recovery':
        return (
          <BackupRecovery 
            onBackToLogin={() => setAuthMode('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthPage;
