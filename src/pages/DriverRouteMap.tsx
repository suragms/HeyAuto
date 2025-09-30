import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Clock, 
  DollarSign, 
  Phone, 
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  User,
  Route,
  Target,
  Compass,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

/**
 * Location interface for geographic coordinates
 * @interface Location
 */
interface Location {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Human-readable address */
  address: string;
}

/**
 * Ride request interface for driver route management
 * @interface RideRequest
 */
interface RideRequest {
  /** Unique ride request ID */
  id: string;
  /** User who requested the ride */
  userId: string;
  /** Pickup location details */
  pickupLocation: Location;
  /** Destination location details */
  destination: Location;
  /** Current ride status */
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  /** Ride fare in rupees */
  fare: number;
  /** Distance in kilometers */
  distance: number;
  /** Estimated time in minutes */
  estimatedTime: number;
  /** User's phone number */
  userPhone: string;
  /** Optional user notes */
  userNotes?: string;
}

/**
 * Driver route map page component
 * Displays driver's current location, available rides, and route management
 * 
 * @component
 * @returns {JSX.Element} The driver route map component
 * 
 * @example
 * ```tsx
 * <DriverRouteMap />
 * ```
 */
const DriverRouteMap: React.FC = () => {
  /** Navigation hook */
  const navigate = useNavigate();
  /** Driver authentication context */
  const { driver, updateLocation, updateStatus, logout } = useDriverAuth();
  /** Driver's current location */
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [navigationMode, setNavigationMode] = useState<'idle' | 'to_pickup' | 'to_destination' | 'completed'>('idle');
  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    duration: 0,
    directions: [] as string[]
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Simulate current location
  useEffect(() => {
    if (driver) {
      // Simulate getting current location
      const mockLocation: Location = {
        latitude: 10.5 + Math.random() * 0.1,
        longitude: 76.2 + Math.random() * 0.1,
        address: 'Current Location'
      };
      setCurrentLocation(mockLocation);
      
      // Update driver location in database
      updateLocation(mockLocation.latitude, mockLocation.longitude);
    }
  }, [driver, updateLocation]);

  // Simulate ride request
  useEffect(() => {
    if (driver?.status === 'available') {
      const interval = setInterval(() => {
        // Simulate receiving a ride request
        const mockRide: RideRequest = {
          id: `ride_${Date.now()}`,
          userId: `user_${Math.random().toString(36).substr(2, 9)}`,
          pickupLocation: {
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1,
            address: `Pickup Location ${Math.floor(Math.random() * 100)}`
          },
          destination: {
            latitude: 10.5 + Math.random() * 0.1,
            longitude: 76.2 + Math.random() * 0.1,
            address: `Destination ${Math.floor(Math.random() * 100)}`
          },
          status: 'pending',
          fare: Math.floor(Math.random() * 200) + 50,
          distance: Math.floor(Math.random() * 20) + 2,
          estimatedTime: Math.floor(Math.random() * 30) + 10,
          userPhone: '+91 98765' + Math.floor(Math.random() * 10000).toString().padStart(5, '0'),
          userNotes: Math.random() > 0.5 ? 'Please call when you arrive' : undefined
        };

        setCurrentRide(mockRide);
        setNavigationMode('to_pickup');
        updateStatus('busy');
      }, 60000); // New ride every minute

      return () => clearInterval(interval);
    }
  }, [driver?.status, updateStatus]);

  const handleAcceptRide = () => {
    if (currentRide) {
      setCurrentRide(prev => prev ? { ...prev, status: 'accepted' } : null);
      setNavigationMode('to_pickup');
      setIsNavigating(true);
    }
  };

  const handleRejectRide = () => {
    setCurrentRide(null);
    setNavigationMode('idle');
    updateStatus('available');
  };

  const handleArrivedAtPickup = () => {
    if (currentRide) {
      setNavigationMode('to_destination');
      // Simulate starting the ride
    }
  };

  const handleStartRide = () => {
    if (currentRide) {
      setCurrentRide(prev => prev ? { ...prev, status: 'in_progress' } : null);
      setNavigationMode('to_destination');
    }
  };

  const handleCompleteRide = () => {
    if (currentRide) {
      setCurrentRide(null);
      setNavigationMode('completed');
      updateStatus('available');
      setIsNavigating(false);
      
      // Reset after a delay
      setTimeout(() => {
        setNavigationMode('idle');
      }, 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/driver/auth');
  };

  const getNavigationStatus = () => {
    switch (navigationMode) {
      case 'to_pickup':
        return {
          status: 'Go to Pickup',
          color: 'bg-blue-600',
          icon: <MapPin className="h-4 w-4" />
        };
      case 'to_destination':
        return {
          status: 'Go to Destination',
          color: 'bg-green-600',
          icon: <Target className="h-4 w-4" />
        };
      case 'completed':
        return {
          status: 'Ride Completed',
          color: 'bg-green-500',
          icon: <CheckCircle className="h-4 w-4" />
        };
      default:
        return {
          status: 'Waiting for Rides',
          color: 'bg-gray-500',
          icon: <Car className="h-4 w-4" />
        };
    }
  };

  const navStatus = getNavigationStatus();

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
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-900">Driver Navigation</h1>
                  <p className="text-xs text-slate-500">Route guidance and ride management</p>
                </div>
              </div>
              
              {/* Navigation Status */}
              <Badge className={`${navStatus.color} text-white`}>
                {navStatus.icon}
                <span className="ml-1">{navStatus.status}</span>
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/driver/dashboard')}
                className="text-slate-600 hover:text-slate-900"
              >
                <Car className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
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
                variant="ghost"
                size="sm"
                onClick={() => navigate('/driver/auto-details')}
                className="text-slate-600 hover:text-slate-900"
              >
                <Car className="mr-2 h-4 w-4" />
                Auto Details
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Interactive Map
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Simulated Map */}
                <div className="w-full h-[500px] bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden rounded-b-lg">
                  {/* Map Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-6 h-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-slate-300"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Current Location Marker */}
                  {currentLocation && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                        You are here
                      </div>
                    </div>
                  )}
                  
                  {/* Pickup Location Marker */}
                  {currentRide && navigationMode === 'to_pickup' && (
                    <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Pickup
                      </div>
                    </div>
                  )}
                  
                  {/* Destination Marker */}
                  {currentRide && navigationMode === 'to_destination' && (
                    <div className="absolute top-3/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Destination
                      </div>
                    </div>
                  )}
                  
                  {/* Route Line */}
                  {currentRide && isNavigating && (
                    <svg className="absolute inset-0 w-full h-full">
                      <path
                        d="M 50% 50% L 33% 25% L 67% 75%"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        fill="none"
                        className="animate-pulse"
                      />
                    </svg>
                  )}
                  
                  {/* Map Controls */}
                  <div className="absolute bottom-4 right-4 space-y-2">
                    <Button size="sm" variant="outline" className="bg-white/90">
                      <Compass className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/90">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Current Ride Card */}
            {currentRide ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Car className="mr-2 h-5 w-5" />
                      Current Ride
                    </div>
                    <Badge variant={currentRide.status === 'pending' ? 'secondary' : 'default'}>
                      {currentRide.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Pickup Location</Label>
                      <p className="font-semibold text-slate-900">{currentRide.pickupLocation.address}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Destination</Label>
                      <p className="font-semibold text-slate-900">{currentRide.destination.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-600">₹{currentRide.fare}</p>
                        <p className="text-xs text-slate-600">Fare</p>
                      </div>
                      <div className="text-center">
                        <Route className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">{currentRide.distance} km</p>
                        <p className="text-xs text-slate-600">Distance</p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-lg font-bold">{currentRide.estimatedTime} min</p>
                        <p className="text-xs text-slate-600">Duration</p>
                      </div>
                    </div>
                    
                    {currentRide.userNotes && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{currentRide.userNotes}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {currentRide.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAcceptRide}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Ride
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRejectRide}
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}
                  
                  {currentRide.status === 'accepted' && navigationMode === 'to_pickup' && (
                    <div className="space-y-3">
                      <Alert>
                        <Navigation className="h-4 w-4" />
                        <AlertDescription>
                          Navigate to pickup location. Call customer when you arrive.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleArrivedAtPickup}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Arrived at Pickup
                        </Button>
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {navigationMode === 'to_destination' && (
                    <div className="space-y-3">
                      <Alert>
                        <Target className="h-4 w-4" />
                        <AlertDescription>
                          Navigate to destination. Complete ride when you arrive.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleStartRide}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Start Ride
                        </Button>
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {currentRide.status === 'in_progress' && (
                    <Button
                      onClick={handleCompleteRide}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Ride
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Ride</h3>
                  <p className="text-slate-600">
                    You're online and ready to accept ride requests. New requests will appear here.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Driver Status Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Driver Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Name</span>
                    <span className="font-semibold">{driver?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vehicle</span>
                    <span className="font-semibold">{driver?.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={driver?.status === 'available' ? 'bg-green-100 text-green-800' : driver?.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                      {driver?.status?.charAt(0).toUpperCase() + driver?.status?.slice(1)}
                    </Badge>
                  </div>
                  {currentLocation && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Location</span>
                      <span className="text-xs text-slate-600">Updated</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/driver/dashboard')}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRouteMap;
