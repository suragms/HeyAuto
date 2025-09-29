import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  MapPin, 
  Star, 
  LogOut, 
  User, 
  Settings, 
  Clock, 
  DollarSign, 
  Navigation,
  Phone,
  CheckCircle,
  XCircle,
  Bell,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Zap,
  Shield,
  Award,
  Activity,
  RefreshCw,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { RideRequest } from '@/types/database';

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { driver, updateStatus, logout, updateLocation } = useDriverAuth();
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    totalRides: 0,
    hourlyRate: 0,
    dailyGoal: 1500,
    weeklyGoal: 10000
  });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(driver?.status === 'available');
  const [rideHistory, setRideHistory] = useState<RideRequest[]>([]);
  const [performanceStats, setPerformanceStats] = useState({
    acceptanceRate: 85,
    rating: 4.8,
    responseTime: 2.3,
    completionRate: 98
  });

  // Simulate ride requests
  useEffect(() => {
    if (driver?.status === 'available') {
      const interval = setInterval(() => {
        // Simulate new ride requests
        const newRequest: RideRequest = {
          id: Date.now().toString(),
          userId: 'user_' + Math.random().toString(36).substr(2, 9),
          pickupLocation: {
            address: `Location ${Math.floor(Math.random() * 100)}`,
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1
          },
          destination: {
            address: `Destination ${Math.floor(Math.random() * 100)}`,
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1
          },
          status: 'pending',
          fare: Math.floor(Math.random() * 200) + 50,
          distance: Math.floor(Math.random() * 20) + 2,
          estimatedTime: Math.floor(Math.random() * 30) + 10,
          createdAt: new Date().toISOString(),
          userPhone: '+91 98765' + Math.floor(Math.random() * 10000).toString().padStart(5, '0'),
          userNotes: Math.random() > 0.5 ? 'Please call when you arrive' : undefined
        };

        setRideRequests(prev => [newRequest, ...prev.slice(0, 4)]);
        setNotifications(prev => [`New ride request from ${newRequest.pickupLocation.address}`, ...prev.slice(0, 2)]);
      }, 30000); // New request every 30 seconds

      return () => clearInterval(interval);
    }
  }, [driver?.status]);

  // Simulate earnings data
  useEffect(() => {
    if (driver) {
      const todayEarnings = Math.floor(Math.random() * 2000) + 500;
      const weekEarnings = Math.floor(Math.random() * 10000) + 3000;
      const monthEarnings = Math.floor(Math.random() * 40000) + 15000;
      
      setEarnings({
        today: todayEarnings,
        week: weekEarnings,
        month: monthEarnings,
        totalRides: driver.totalRides,
        hourlyRate: Math.floor(todayEarnings / 8), // Assuming 8 hours work
        dailyGoal: 1500,
        weeklyGoal: 10000
      });
    }
  }, [driver]);

  // Simulate ride history
  useEffect(() => {
    if (driver) {
      const history: RideRequest[] = [];
      for (let i = 0; i < 10; i++) {
        history.push({
          id: `ride_${i}`,
          userId: `user_${i}`,
          pickupLocation: {
            address: `Pickup Location ${i + 1}`,
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1
          },
          destination: {
            address: `Destination ${i + 1}`,
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1
          },
          status: 'completed',
          fare: Math.floor(Math.random() * 200) + 50,
          distance: Math.floor(Math.random() * 20) + 2,
          estimatedTime: Math.floor(Math.random() * 30) + 10,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          userPhone: '+91 98765' + Math.floor(Math.random() * 10000).toString().padStart(5, '0')
        });
      }
      setRideHistory(history);
    }
  }, [driver]);

  const handleStatusChange = async (status: 'available' | 'busy' | 'offline') => {
    await updateStatus(status);
    if (status === 'available') {
      setNotifications(prev => ['You are now online and ready to accept rides', ...prev.slice(0, 2)]);
    }
  };

  const handleAcceptRide = (request: RideRequest) => {
    setCurrentRide({ ...request, status: 'accepted', acceptedAt: new Date().toISOString() });
    setRideRequests(prev => prev.filter(r => r.id !== request.id));
    setNotifications(prev => [`Ride accepted! Pickup: ${request.pickupLocation.address}`, ...prev.slice(0, 2)]);
    updateStatus('busy');
  };

  const handleRejectRide = (requestId: string) => {
    setRideRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleCompleteRide = () => {
    if (currentRide) {
      setEarnings(prev => ({
        ...prev,
        today: prev.today + currentRide.fare,
        totalRides: prev.totalRides + 1
      }));
      setCurrentRide(null);
      setNotifications(prev => [`Ride completed! Earned ₹${currentRide.fare}`, ...prev.slice(0, 2)]);
      updateStatus('available');
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

  if (!driver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No driver data found</p>
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
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-900">Driver Hub</h1>
                  <p className="text-xs text-slate-500">Welcome back, {driver?.name}</p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${driver?.status === 'available' ? 'bg-green-500' : driver?.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium capitalize">{driver?.status}</span>
              </div>
              
              {notifications.length > 0 && (
                <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  <Bell className="h-4 w-4 animate-pulse" />
                  <span className="ml-1 text-sm font-medium">{notifications.length}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/driver/profile')}
                className="text-slate-600 hover:text-slate-900"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
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
        {/* Enhanced Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Bell className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {notifications[0]}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Current Ride - Enhanced */}
        {currentRide && (
          <Card className="mb-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Navigation className="mr-2 h-5 w-5" />
                Active Ride
                <Badge className="ml-2 bg-green-600">In Progress</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">Pickup Location</p>
                  <p className="text-lg font-semibold text-green-900">{currentRide.pickupLocation.address}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">Destination</p>
                  <p className="text-lg font-semibold text-green-900">{currentRide.destination.address}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">Fare & Distance</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-green-600">₹{currentRide.fare}</span>
                    <span className="text-lg text-green-800">{currentRide.distance} km</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={handleCompleteRide} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Ride
                </Button>
                <Button variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Earnings</span>
            </TabsTrigger>
            <TabsTrigger value="rides" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Rides</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Status & Controls */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enhanced Status Card */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Driver Status
                      </div>
                      <Badge className={getStatusColor(driver?.status || 'offline')}>
                        {driver?.status?.charAt(0).toUpperCase() + driver?.status?.slice(1)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                          driver?.status === 'available' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleStatusChange('available')}
                        disabled={!!currentRide}
                      >
                        <Zap className="h-5 w-5" />
                        <span className="text-sm font-medium">Go Online</span>
                      </Button>
                      <Button
                        className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                          driver?.status === 'busy' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleStatusChange('busy')}
                        disabled={!!currentRide}
                      >
                        <Clock className="h-5 w-5" />
                        <span className="text-sm font-medium">Mark Busy</span>
                      </Button>
                      <Button
                        className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                          driver?.status === 'offline' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleStatusChange('offline')}
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Go Offline</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ride Requests - Enhanced */}
                {driver?.status === 'available' && rideRequests.length > 0 && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="mr-2 h-5 w-5" />
                          New Ride Requests
                        </div>
                        <Badge variant="secondary">{rideRequests.length} pending</Badge>
                      </CardTitle>
                      <CardDescription>Accept or reject incoming ride requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rideRequests.slice(0, 2).map((request) => (
                          <div key={request.id} className="border border-slate-200 rounded-xl p-4 space-y-4 bg-white hover:shadow-md transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-600">From</p>
                                <p className="font-semibold text-slate-900">{request.pickupLocation.address}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-600">To</p>
                                <p className="font-semibold text-slate-900">{request.destination.address}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <div className="text-center">
                                  <p className="text-sm text-slate-600">Fare</p>
                                  <p className="text-xl font-bold text-green-600">₹{request.fare}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-slate-600">Distance</p>
                                  <p className="text-lg font-semibold">{request.distance} km</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-slate-600">Time</p>
                                  <p className="text-lg font-semibold">{request.estimatedTime} min</p>
                                </div>
                              </div>
                            </div>
                            
                            {request.userNotes && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  <strong>Customer Note:</strong> {request.userNotes}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRide(request)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Ride
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRide(request.id)}
                                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Enhanced Info Cards */}
              <div className="space-y-6">
                {/* Driver Info - Enhanced */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{driver?.name}</p>
                        <p className="text-sm text-slate-600">{driver?.vehicleNumber}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Phone</span>
                        <span className="font-medium">{driver?.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Verification</span>
                        <Badge variant={driver?.isVerified ? 'default' : 'secondary'}>
                          {driver?.isVerified ? (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              Verified
                            </>
                          ) : (
                            'Pending'
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{driver?.rating?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Stats - Enhanced */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Acceptance Rate</span>
                        <span className="font-semibold">{performanceStats.acceptanceRate}%</span>
                      </div>
                      <Progress value={performanceStats.acceptanceRate} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Completion Rate</span>
                        <span className="font-semibold">{performanceStats.completionRate}%</span>
                      </div>
                      <Progress value={performanceStats.completionRate} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Response Time</span>
                      <span className="font-semibold">{performanceStats.responseTime}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Total Rides</span>
                      <span className="font-semibold">{earnings.totalRides}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions - Enhanced */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        onClick={() => navigate('/driver/profile')}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        onClick={() => navigate('/driver/auto-details')}
                      >
                        <Car className="mr-3 h-4 w-4" />
                        Auto Details
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        onClick={() => setActiveTab('rides')}
                      >
                        <Clock className="mr-3 h-4 w-4" />
                        Ride History
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        onClick={() => setActiveTab('earnings')}
                      >
                        <DollarSign className="mr-3 h-4 w-4" />
                        View Earnings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        onClick={() => setActiveTab('analytics')}
                      >
                        <BarChart3 className="mr-3 h-4 w-4" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Today</p>
                      <p className="text-3xl font-bold text-slate-900">₹{earnings.today}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(earnings.today / earnings.dailyGoal) * 100} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">Goal: ₹{earnings.dailyGoal}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">This Week</p>
                      <p className="text-3xl font-bold text-slate-900">₹{earnings.week}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(earnings.week / earnings.weeklyGoal) * 100} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">Goal: ₹{earnings.weeklyGoal}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">This Month</p>
                      <p className="text-3xl font-bold text-slate-900">₹{earnings.month}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Hourly Rate</p>
                      <p className="text-3xl font-bold text-slate-900">₹{earnings.hourlyRate}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rides Tab */}
          <TabsContent value="rides" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Recent Rides
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rideHistory.slice(0, 5).map((ride) => (
                    <div key={ride.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">{ride.pickupLocation.address}</p>
                          <p className="text-sm text-slate-600">to {ride.destination.address}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(ride.createdAt).toLocaleDateString()} at {new Date(ride.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₹{ride.fare}</p>
                          <p className="text-sm text-slate-600">{ride.distance} km</p>
                          <Badge variant="secondary" className="mt-1">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Customer Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{driver?.rating?.toFixed(1)}/5.0</span>
                      </div>
                    </div>
                    <Progress value={(driver?.rating || 0) * 20} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Ride Acceptance Rate</span>
                      <span className="font-semibold">{performanceStats.acceptanceRate}%</span>
                    </div>
                    <Progress value={performanceStats.acceptanceRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Completion Rate</span>
                      <span className="font-semibold">{performanceStats.completionRate}%</span>
                    </div>
                    <Progress value={performanceStats.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Goals & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Daily Earnings Goal</span>
                      <span className="font-semibold">₹{earnings.dailyGoal}</span>
                    </div>
                    <Progress value={(earnings.today / earnings.dailyGoal) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">Current: ₹{earnings.today}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Weekly Earnings Goal</span>
                      <span className="font-semibold">₹{earnings.weeklyGoal}</span>
                    </div>
                    <Progress value={(earnings.week / earnings.weeklyGoal) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">Current: ₹{earnings.week}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Total Rides</span>
                      <span className="font-semibold">{earnings.totalRides}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
