import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Car, CheckCircle, Loader2 } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

interface DriverSignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

const DriverSignupForm: React.FC<DriverSignupFormProps> = ({ 
  onSwitchToLogin,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleNumber: '',
    licenseNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { register } = useDriverAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.vehicleNumber.trim()) {
      setError('Vehicle number is required');
      return false;
    }
    if (!formData.licenseNumber.trim()) {
      setError('License number is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber
      });
      
      if (success) {
        setSuccess(true);
        setIsRedirecting(true);
        // Redirect to dashboard after successful registration and auto-login
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setError('Registration failed. Email, phone, or vehicle number may already be in use.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-500/20 rounded-full animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Registration Successful!</h3>
          <p className="text-slate-300 mb-6">
            Your driver account has been created and you're now logged in. Redirecting you to your dashboard...
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <h2 className="text-2xl font-bold text-white mb-2">Driver Registration</h2>
        <p className="text-slate-300">
          Join our driver network and start earning
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-white font-medium">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                type="text"
                placeholder="e.g., KL 47 B 5501"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="licenseNumber" className="text-white font-medium">License Number</Label>
              <Input
                id="licenseNumber"
                type="text"
                placeholder="Enter your driving license number"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Driver Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Already have an account? </span>
          <Button
            variant="link"
            className="p-0 h-auto font-normal text-primary hover:text-primary/80"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverSignupForm;
