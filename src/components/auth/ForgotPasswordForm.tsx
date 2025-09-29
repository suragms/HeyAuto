import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onBackToLogin, 
  onSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await resetPassword(email);
      if (success) {
        setIsSubmitted(true);
      } else {
        setError('Email not found. Please check your email address or register first.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Check Your Email
          </CardTitle>
          <CardDescription>
            We've sent password reset instructions to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              If you don't see the email, check your spam folder or try again.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
                setError('');
              }}
              variant="outline"
              className="w-full"
            >
              Try Different Email
            </Button>
            
            <Button
              onClick={onBackToLogin}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLogin}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </div>
          <div className="w-16"></div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onBackToLogin}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
