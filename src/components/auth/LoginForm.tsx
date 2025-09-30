import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SocialLogin from './SocialLogin';

/**
 * Props for the LoginForm component
 * @interface LoginFormProps
 */
interface LoginFormProps {
  /** Function to switch to registration form */
  onSwitchToRegister: () => void;
  /** Function to switch to backup login form */
  onSwitchToBackup: () => void;
  /** Function to switch to forgot password form */
  onSwitchToForgotPassword: () => void;
  /** Function to switch to recovery form */
  onSwitchToRecovery: () => void;
  /** Optional callback when login is successful */
  onSuccess?: () => void;
}

/**
 * Login form component with email/password authentication and social login options
 * 
 * @component
 * @param {LoginFormProps} props - Component props
 * @returns {JSX.Element} The login form component
 * 
 * @example
 * ```tsx
 * <LoginForm 
 *   onSwitchToRegister={() => setMode('register')}
 *   onSwitchToBackup={() => setMode('backup')}
 *   onSwitchToForgotPassword={() => setMode('forgot')}
 *   onSwitchToRecovery={() => setMode('recovery')}
 *   onSuccess={() => navigate('/')}
 * />
 * ```
 */
const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToRegister, 
  onSwitchToBackup, 
  onSwitchToForgotPassword, 
  onSwitchToRecovery,
  onSuccess 
}) => {
  /** User's email address */
  const [email, setEmail] = useState('');
  /** User's password */
  const [password, setPassword] = useState('');
  /** Whether password is visible */
  const [showPassword, setShowPassword] = useState(false);
  /** Error message to display */
  const [error, setError] = useState('');
  /** Loading state during authentication */
  const [isLoading, setIsLoading] = useState(false);
  
  /** Authentication context */
  const { login, loginWithGoogle, loginWithGithub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        onSuccess?.();
      } else {
        setError('Google login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const success = await loginWithGithub();
      if (success) {
        onSuccess?.();
      } else {
        setError('GitHub login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during GitHub login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <SocialLogin
          onGoogleLogin={handleGoogleLogin}
          onGithubLogin={handleGithubLogin}
          isLoading={isLoading}
        />

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={onSwitchToRegister}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={onSwitchToBackup}
              disabled={isLoading}
              className="w-full"
            >
              Alternative Login Options
            </Button>
            
            <Button
              variant="ghost"
              onClick={onSwitchToForgotPassword}
              disabled={isLoading}
              className="w-full text-sm"
            >
              Forgot Password?
            </Button>
            
            <Button
              variant="ghost"
              onClick={onSwitchToRecovery}
              disabled={isLoading}
              className="w-full text-sm text-muted-foreground"
            >
              Can't access your account? Try recovery
            </Button>
          </div>
        </div>
        

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium mb-1">New User?</p>
          <p className="text-xs text-green-700">
            After registration, you'll be redirected here to log in with your new account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
