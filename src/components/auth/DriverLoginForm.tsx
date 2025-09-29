import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Car, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

interface DriverLoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToPhoneLogin: () => void;
  onSuccess?: () => void;
}

const DriverLoginForm: React.FC<DriverLoginFormProps> = ({ 
  onSwitchToRegister, 
  onSwitchToPhoneLogin,
  onSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { login } = useDriverAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Attempting driver login with:', { email, password: '***' });

    try {
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        setIsSuccess(true);
        console.log('Login successful, showing success state');
        // Show success state briefly before redirecting
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          onSuccess?.();
        }, 1500);
      } else {
        console.log('Login failed: Invalid credentials');
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-500/20 rounded-full animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Login Successful!</h3>
          <p className="text-slate-300 mb-6">
            Welcome back! Redirecting you to your dashboard...
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Driver Login</h2>
        <p className="text-slate-300">
          Sign in to your driver account to start accepting rides
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
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
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
          disabled={isLoading || isSuccess}
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

      <div className="mt-8 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-4 text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
          onClick={onSwitchToPhoneLogin}
          disabled={isLoading}
        >
          <Phone className="mr-2 h-4 w-4" />
          Sign in with Phone
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-slate-400">Don't have an account? </span>
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-yellow-500 hover:text-yellow-400"
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Sign up as a driver
        </Button>
      </div>
    </div>
  );
};

export default DriverLoginForm;
