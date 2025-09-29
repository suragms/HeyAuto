import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Eye, EyeOff, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BackupLoginFormProps {
  onSwitchToRegister: () => void;
  onBackToEmail: () => void;
  onSuccess?: () => void;
}

const BackupLoginForm: React.FC<BackupLoginFormProps> = ({ 
  onSwitchToRegister, 
  onBackToEmail, 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState('phone');
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithPhone, sendOTP, verifyOTP } = useAuth();

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await loginWithPhone(phone, phonePassword);
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid phone number or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await sendOTP(phone);
      if (success) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Phone number not found. Please check your number or register first.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await verifyOTP(phone, otp);
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToEmail}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <CardTitle className="text-2xl font-bold">Backup Login</CardTitle>
            <CardDescription>
              Alternative ways to access your account
            </CardDescription>
          </div>
          <div className="w-16"></div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="otp" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              OTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-4">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phonePassword">Password</Label>
                <div className="relative">
                  <Input
                    id="phonePassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={phonePassword}
                    onChange={(e) => setPhonePassword(e.target.value)}
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
                disabled={isLoading || !phone || !phonePassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In with Phone'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="otp" className="space-y-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpPhone">Phone Number</Label>
                  <Input
                    id="otpPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  onClick={handleSendOTP}
                  className="w-full"
                  disabled={isLoading || !phone}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a 6-digit OTP to {phone}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    disabled={isLoading}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="w-full"
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>
              </form>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
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
      </CardContent>
    </Card>
  );
};

export default BackupLoginForm;
