import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Shield, Phone, Mail, Key, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Props for the BackupRecovery component
 * @interface BackupRecoveryProps
 */
interface BackupRecoveryProps {
  /** Function to go back to login form */
  onBackToLogin: () => void;
  /** Optional success callback */
  onSuccess?: () => void;
}

/**
 * Backup recovery component for account recovery
 * Provides multiple recovery methods including phone, email, and security questions
 * 
 * @component
 * @param {BackupRecoveryProps} props - Component props
 * @returns {JSX.Element} The backup recovery component
 * 
 * @example
 * ```tsx
 * <BackupRecovery
 *   onBackToLogin={() => setMode('login')}
 *   onSuccess={() => navigate('/dashboard')}
 * />
 * ```
 */
const BackupRecovery: React.FC<BackupRecoveryProps> = ({ 
  onBackToLogin, 
  onSuccess 
}) => {
  /** Selected recovery method */
  const [recoveryMethod, setRecoveryMethod] = useState<'phone' | 'email' | 'security'>('phone');
  /** Phone number for recovery */
  const [phone, setPhone] = useState('');
  /** Email address for recovery */
  const [email, setEmail] = useState('');
  /** Security answer for recovery */
  const [securityAnswer, setSecurityAnswer] = useState('');
  /** Loading state during recovery */
  const [isLoading, setIsLoading] = useState(false);
  /** Whether recovery was successful */
  const [isRecovered, setIsRecovered] = useState(false);
  /** Error message to display */
  const [error, setError] = useState('');
  
  /** Authentication context */
  const { sendOTP, resetPassword } = useAuth();

  const handlePhoneRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await sendOTP(phone);
      if (success) {
        setIsRecovered(true);
      } else {
        setError('Phone number not found. Please check your number or contact support.');
      }
    } catch (err) {
      setError('Failed to send recovery code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await resetPassword(email);
      if (success) {
        setIsRecovered(true);
      } else {
        setError('Email not found. Please check your email or contact support.');
      }
    } catch (err) {
      setError('Failed to send recovery email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate security question verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (securityAnswer.toLowerCase() === 'vadanappally') {
        setIsRecovered(true);
      } else {
        setError('Incorrect answer. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isRecovered) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Recovery Successful
          </CardTitle>
          <CardDescription>
            Your account recovery has been initiated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {recoveryMethod === 'phone' && 'We\'ve sent a recovery code to your phone.'}
              {recoveryMethod === 'email' && 'We\'ve sent password reset instructions to your email.'}
              {recoveryMethod === 'security' && 'Your security question has been verified.'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => {
                setIsRecovered(false);
                setError('');
                setPhone('');
                setEmail('');
                setSecurityAnswer('');
              }}
              variant="outline"
              className="w-full"
            >
              Try Another Method
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
            <CardTitle className="text-2xl font-bold">Account Recovery</CardTitle>
            <CardDescription>
              Choose a recovery method to regain access
            </CardDescription>
          </div>
          <div className="w-16"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recovery Method Selection */}
        <div className="space-y-3">
          <Label>Choose Recovery Method</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant={recoveryMethod === 'phone' ? 'default' : 'outline'}
              onClick={() => setRecoveryMethod('phone')}
              className="justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">SMS Recovery</div>
                  <div className="text-xs text-muted-foreground">Get a code via SMS</div>
                </div>
              </div>
            </Button>

            <Button
              variant={recoveryMethod === 'email' ? 'default' : 'outline'}
              onClick={() => setRecoveryMethod('email')}
              className="justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Email Recovery</div>
                  <div className="text-xs text-muted-foreground">Reset via email link</div>
                </div>
              </div>
            </Button>

            <Button
              variant={recoveryMethod === 'security' ? 'default' : 'outline'}
              onClick={() => setRecoveryMethod('security')}
              className="justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Security Question</div>
                  <div className="text-xs text-muted-foreground">Answer security question</div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recovery Forms */}
        {recoveryMethod === 'phone' && (
          <form onSubmit={handlePhoneRecovery} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recoveryPhone">Phone Number</Label>
              <Input
                id="recoveryPhone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !phone}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Recovery Code'
              )}
            </Button>
          </form>
        )}

        {recoveryMethod === 'email' && (
          <form onSubmit={handleEmailRecovery} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recoveryEmail">Email Address</Label>
              <Input
                id="recoveryEmail"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                'Send Recovery Email'
              )}
            </Button>
          </form>
        )}

        {recoveryMethod === 'security' && (
          <form onSubmit={handleSecurityRecovery} className="space-y-4">
            <div className="space-y-2">
              <Label>Security Question</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">What is the name of your hometown?</p>
                <Badge variant="secondary" className="mt-1">
                  Hint: It's a place in Kerala
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="securityAnswer">Your Answer</Label>
              <Input
                id="securityAnswer"
                type="text"
                placeholder="Enter your answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !securityAnswer}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Answer'
              )}
            </Button>
          </form>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupRecovery;
