import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  LogOut, 
  Save, 
  Edit, 
  X, 
  Upload,
  Camera,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertTriangle,
  User,
  Settings,
  BarChart3,
  FileText,
  Navigation,
  Activity,
  Zap
} from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const DriverProfile: React.FC = () => {
  const navigate = useNavigate();
  const { driver, updateProfile, logout, updateStatus, isLoading, changePassword } = useDriverAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatar, setAvatar] = useState(driver?.avatar || '');
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
    vehicleNumber: driver?.vehicleNumber || '',
    licenseNumber: driver?.licenseNumber || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileStats, setProfileStats] = useState({
    profileCompletion: 85,
    verificationStatus: 'pending',
    documentsUploaded: 3,
    totalDocuments: 5
  });

  // Update form data when driver data changes
  useEffect(() => {
    console.log('DriverProfile: Driver data changed:', driver);
    if (driver) {
      setFormData({
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        vehicleNumber: driver.vehicleNumber || '',
        licenseNumber: driver.licenseNumber || ''
      });
      setAvatar(driver.avatar || '');
      console.log('DriverProfile: Form data updated with driver info');
    }
  }, [driver]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword.trim()) {
      setError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword.trim()) {
      setError('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    console.log('DriverProfile: handleSave called with formData:', formData);
    if (!validateForm()) return;
    
    try {
      console.log('DriverProfile: Calling updateProfile with:', formData);
      const success = await updateProfile(formData);
      console.log('DriverProfile: updateProfile result:', success);
      if (success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('DriverProfile: Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setSuccess('Password updated successfully');
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update password. Please check your current password.');
      }
    } catch (error) {
      setError('Failed to update password');
    }
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        vehicleNumber: driver.vehicleNumber || '',
        licenseNumber: driver.licenseNumber || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditingPassword(false);
    setError('');
    setSuccess('');
  };

  const handleStatusChange = async (status: 'available' | 'busy' | 'offline') => {
    try {
      const success = await updateStatus(status);
      if (success) {
        setSuccess(`Status updated to ${status}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update status');
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/driver/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No driver data found</p>
          <p className="text-sm text-muted-foreground mt-2">Please log in to access your profile</p>
          <Button onClick={() => navigate('/driver/auth')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-900">Driver Profile</h1>
                  <p className="text-xs text-slate-500">Manage your account and settings</p>
                </div>
              </div>
          </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('Navigating to dashboard');
                  navigate('/driver/dashboard');
                }}
                className="text-slate-600 hover:text-slate-900"
              >
                <Car className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-slate-200 hover:bg-slate-50"
              >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview Card */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-slate-50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={avatar} alt={driver?.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10">
                    {driver?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{driver?.name}</h2>
                <p className="text-slate-600 mb-4">{driver?.vehicleNumber}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <Badge className={getStatusColor(driver?.status || 'offline')}>
                    {driver?.status?.charAt(0).toUpperCase() + driver?.status?.slice(1)}
                  </Badge>
                  <Badge variant={driver?.isVerified ? 'default' : 'secondary'}>
                    {driver?.isVerified ? (
                      <>
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      'Pending Verification'
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-center md:justify-start space-x-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-semibold">{driver?.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="font-semibold">{driver?.totalRides} rides</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-semibold">{driver?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm text-slate-600">Profile Completion</p>
                  <p className="text-2xl font-bold text-slate-900">{profileStats.profileCompletion}%</p>
                </div>
                <Progress value={profileStats.profileCompletion} className="w-32 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Information Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Full Name</span>
                <span className="font-medium">{driver?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email</span>
                <span className="font-medium">{driver?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Phone</span>
                <span className="font-medium">{driver?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Member Since</span>
                <span className="font-medium">
                  {driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Vehicle Number</span>
                <span className="font-medium">{driver?.vehicleNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">License Number</span>
                <span className="font-medium">{driver?.licenseNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <Badge className={getStatusColor(driver?.status || 'offline')}>
                  {driver?.status?.charAt(0).toUpperCase() + driver?.status?.slice(1) || 'Offline'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Verification</span>
                <Badge variant={driver?.isVerified ? 'default' : 'secondary'}>
                  {driver?.isVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Performance Statistics Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{driver?.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Rides</span>
                <span className="font-medium">{driver?.totalRides || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Login</span>
                <span className="font-medium">
                  {driver?.lastLoginAt ? new Date(driver.lastLoginAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Account Status</span>
                <Badge variant={driver?.isActive ? 'default' : 'secondary'}>
                  {driver?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Activity Summary */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Driver Activity Summary
            </CardTitle>
            <CardDescription>
              Overview of your driving activity and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{driver?.totalRides || 0}</div>
                <div className="text-sm text-blue-600">Total Rides</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{driver?.rating?.toFixed(1) || 'N/A'}</div>
                <div className="text-sm text-yellow-600">Average Rating</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {driver?.isVerified ? '100%' : '0%'}
                </div>
                <div className="text-sm text-green-600">Verification</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {driver?.createdAt ? Math.floor((Date.now() - new Date(driver.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </div>
                <div className="text-sm text-purple-600">Days Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
              <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
                <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                      <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing || isLoading}
                        className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing || isLoading}
                        className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing || isLoading}
                        className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
                  disabled={!isEditing || isLoading}
                        className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>

                    <div className="space-y-2 md:col-span-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  disabled={!isEditing || isLoading}
                        className={!isEditing ? 'bg-slate-50' : ''}
                />
                    </div>
              </div>

              {/* Additional Driver Information */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold text-slate-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Driver ID</Label>
                    <Input
                      value={driver?.id || 'N/A'}
                      disabled
                      className="bg-slate-50 text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <Input
                      value={driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                      disabled
                      className="bg-slate-50 text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <Input
                      value={driver?.updatedAt ? new Date(driver.updatedAt).toLocaleDateString() : 'N/A'}
                      disabled
                      className="bg-slate-50 text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Login</Label>
                    <Input
                      value={driver?.lastLoginAt ? new Date(driver.lastLoginAt).toLocaleDateString() : 'Never'}
                      disabled
                      className="bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Status & Stats */}
              <Card className="shadow-lg">
            <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Driver Status & Stats
                  </CardTitle>
              <CardDescription>Your current status and performance metrics</CardDescription>
            </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Control */}
                  <div className="space-y-4">
                <Label>Current Status</Label>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getStatusColor(driver?.status || 'offline')}>
                        {driver?.status?.charAt(0).toUpperCase() + driver?.status?.slice(1)}
                  </Badge>
                </div>
                    <div className="grid grid-cols-3 gap-3">
                  <Button
                    size="sm"
                        variant={driver?.status === 'available' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('available')}
                    disabled={isLoading}
                        className="h-12"
                  >
                        <Zap className="mr-2 h-4 w-4" />
                    Available
                  </Button>
                  <Button
                    size="sm"
                        variant={driver?.status === 'busy' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('busy')}
                    disabled={isLoading}
                        className="h-12"
                  >
                        <Clock className="mr-2 h-4 w-4" />
                    Busy
                  </Button>
                  <Button
                    size="sm"
                        variant={driver?.status === 'offline' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('offline')}
                    disabled={isLoading}
                        className="h-12"
                  >
                        <X className="mr-2 h-4 w-4" />
                    Offline
                  </Button>
                </div>
              </div>

              <Separator />

                  {/* Performance Stats */}
              <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Performance Metrics</h4>
                    
                    <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Rating</span>
                  </div>
                        <span className="text-lg font-bold">{driver?.rating?.toFixed(1)}/5.0</span>
                </div>
                      <Progress value={(driver?.rating || 0) * 20} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Rides</span>
                  </div>
                        <span className="text-lg font-bold">{driver?.totalRides}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Verification</span>
                  </div>
                        <Badge variant={driver?.isVerified ? 'default' : 'secondary'}>
                          {driver?.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                      </div>
                </div>
              </div>

              <Separator />

                  {/* Account Info */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Member since: {new Date(driver?.createdAt || '').toLocaleDateString()}</span>
                    </div>
                    {driver?.lastLoginAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Last login: {new Date(driver.lastLoginAt).toLocaleDateString()}</span>
                      </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </div>
                  {!isEditingPassword ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handlePasswordCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handlePasswordSave} disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {isEditingPassword && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Document Verification
                </CardTitle>
                <CardDescription>Upload and manage your verification documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Document Management</h3>
                  <p className="text-slate-600 mb-4">
                    Upload your driving license, vehicle registration, and other required documents.
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Document Progress</span>
                    <span className="text-sm text-slate-600">{profileStats.documentsUploaded}/{profileStats.totalDocuments}</span>
                  </div>
                  <Progress value={(profileStats.documentsUploaded / profileStats.totalDocuments) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Settings Coming Soon</h3>
                  <p className="text-slate-600">
                    Additional settings and preferences will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverProfile;
