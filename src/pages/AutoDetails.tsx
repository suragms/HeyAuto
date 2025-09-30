import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  Wrench, 
  Fuel, 
  Calendar, 
  Shield, 
  Star, 
  LogOut,
  User,
  Settings,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  Gauge
} from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

/**
 * Auto details interface for vehicle information
 * @interface AutoDetails
 */
interface AutoDetails {
  /** Vehicle ID */
  id: string;
  /** Vehicle registration number */
  vehicleNumber: string;
  /** Vehicle manufacturer */
  make: string;
  /** Vehicle model */
  model: string;
  /** Manufacturing year */
  year: number;
  /** Vehicle color */
  color: string;
  /** Fuel type */
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  /** Engine capacity */
  engineCapacity: string;
  /** Seating capacity */
  seatingCapacity: number;
  /** Registration date */
  registrationDate: string;
  insuranceExpiry: string;
  pollutionCertificate: string;
  fitnessCertificate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  mileage: number;
  fuelEfficiency: number;
  status: 'active' | 'maintenance' | 'inactive';
  features: string[];
  documents: {
    rcBook: boolean;
    insurance: boolean;
    pollutionCertificate: boolean;
    fitnessCertificate: boolean;
    permit: boolean;
  };
}

/**
 * Auto details page component for vehicle management
 * Displays and manages driver's vehicle information, documents, and maintenance
 * 
 * @component
 * @returns {JSX.Element} The auto details component
 * 
 * @example
 * ```tsx
 * <AutoDetails />
 * ```
 */
const AutoDetails: React.FC = () => {
  /** Navigation hook */
  const navigate = useNavigate();
  /** Driver authentication context */
  const { driver, updateProfile, logout } = useDriverAuth();
  /** Active tab in the interface */
  const [activeTab, setActiveTab] = useState('overview');
  /** Whether editing mode is active */
  const [isEditing, setIsEditing] = useState(false);
  /** Error message to display */
  const [error, setError] = useState('');
  /** Success message to display */
  const [success, setSuccess] = useState('');
  const [autoDetails, setAutoDetails] = useState<AutoDetails>({
    id: driver?.id || '',
    vehicleNumber: driver?.vehicleNumber || '',
    make: 'Bajaj',
    model: 'RE Auto',
    year: 2022,
    color: 'Yellow & Black',
    fuelType: 'petrol',
    engineCapacity: '150cc',
    seatingCapacity: 3,
    registrationDate: '2022-01-15',
    insuranceExpiry: '2024-12-31',
    pollutionCertificate: '2024-06-30',
    fitnessCertificate: '2025-01-15',
    lastServiceDate: '2024-01-15',
    nextServiceDate: '2024-07-15',
    mileage: 25000,
    fuelEfficiency: 35,
    status: 'active',
    features: ['GPS Navigation', 'Digital Meter', 'Comfortable Seating', 'LED Lights'],
    documents: {
      rcBook: true,
      insurance: true,
      pollutionCertificate: true,
      fitnessCertificate: true,
      permit: true
    }
  });

  const [editData, setEditData] = useState(autoDetails);

  useEffect(() => {
    setEditData(autoDetails);
  }, [autoDetails]);

  const handleInputChange = (field: keyof AutoDetails, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setAutoDetails(editData);
      setSuccess('Auto details updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update auto details');
    }
  };

  const handleCancel = () => {
    setEditData(autoDetails);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/driver/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol':
        return 'bg-red-100 text-red-800';
      case 'diesel':
        return 'bg-blue-100 text-blue-800';
      case 'electric':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const documentCompletion = Math.round(
    (Object.values(autoDetails.documents).filter(Boolean).length / 
     Object.keys(autoDetails.documents).length) * 100
  );

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
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-900">Auto Details</h1>
                  <p className="text-xs text-slate-500">Vehicle information and management</p>
                </div>
              </div>
              
              {/* Vehicle Status */}
              <Badge className={getStatusColor(autoDetails.status)}>
                {autoDetails.status.charAt(0).toUpperCase() + autoDetails.status.slice(1)}
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
                onClick={() => navigate('/driver/route-map')}
                className="text-slate-600 hover:text-slate-900"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Route Map
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
        {/* Auto Overview Card */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-slate-50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Vehicle Image/Icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  <Car className="h-12 w-12 text-primary" />
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById('vehicle-photo')?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  id="vehicle-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Vehicle Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {autoDetails.make} {autoDetails.model}
                </h2>
                <p className="text-slate-600 mb-4">{autoDetails.vehicleNumber}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <Badge className={getFuelTypeColor(autoDetails.fuelType)}>
                    <Fuel className="mr-1 h-3 w-3" />
                    {autoDetails.fuelType.charAt(0).toUpperCase() + autoDetails.fuelType.slice(1)}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="mr-1 h-3 w-3" />
                    {autoDetails.year}
                  </Badge>
                  <Badge variant="outline">
                    {autoDetails.seatingCapacity} Seater
                  </Badge>
                </div>

                <div className="flex items-center justify-center md:justify-start space-x-6">
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="font-semibold">{autoDetails.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-semibold">{autoDetails.fuelEfficiency} km/l</span>
                  </div>
                </div>
              </div>

              {/* Document Completion */}
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm text-slate-600">Document Completion</p>
                  <p className="text-2xl font-bold text-slate-900">{documentCompletion}%</p>
                </div>
                <Progress value={documentCompletion} className="w-32 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Specifications</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Car className="mr-2 h-5 w-5" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>Essential vehicle details</CardDescription>
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
                        <Button size="sm" onClick={handleSave}>
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
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        value={isEditing ? editData.make : autoDetails.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-slate-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={isEditing ? editData.model : autoDetails.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-slate-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={isEditing ? editData.year : autoDetails.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-slate-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={isEditing ? editData.color : autoDetails.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-slate-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Fuel Type</Label>
                      <select
                        id="fuelType"
                        value={isEditing ? editData.fuelType : autoDetails.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                        disabled={!isEditing}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!isEditing ? 'bg-slate-50' : ''}`}
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engineCapacity">Engine Capacity</Label>
                      <Input
                        id="engineCapacity"
                        value={isEditing ? editData.engineCapacity : autoDetails.engineCapacity}
                        onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-slate-50' : ''}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Status & Performance */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="mr-2 h-5 w-5" />
                    Vehicle Status & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Status</span>
                      <Badge className={getStatusColor(autoDetails.status)}>
                        {autoDetails.status.charAt(0).toUpperCase() + autoDetails.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <Gauge className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-lg font-bold">{autoDetails.mileage.toLocaleString()}</p>
                        <p className="text-xs text-slate-600">Total Mileage (km)</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-lg font-bold">{autoDetails.fuelEfficiency}</p>
                        <p className="text-xs text-slate-600">Fuel Efficiency (km/l)</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Vehicle Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {autoDetails.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Registration Date</span>
                        <span className="font-medium">{new Date(autoDetails.registrationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Seating Capacity</span>
                        <span className="font-medium">{autoDetails.seatingCapacity} passengers</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Last Service</span>
                        <span className="font-medium">{new Date(autoDetails.lastServiceDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>Detailed technical information about your vehicle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Engine & Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Engine Type</span>
                        <span className="font-medium">{autoDetails.fuelType.charAt(0).toUpperCase() + autoDetails.fuelType.slice(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Engine Capacity</span>
                        <span className="font-medium">{autoDetails.engineCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fuel Efficiency</span>
                        <span className="font-medium">{autoDetails.fuelEfficiency} km/l</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Dimensions & Capacity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Seating Capacity</span>
                        <span className="font-medium">{autoDetails.seatingCapacity} passengers</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Vehicle Type</span>
                        <span className="font-medium">Auto Rickshaw</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Body Type</span>
                        <span className="font-medium">3-Wheeler</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Features & Equipment</h4>
                    <div className="space-y-2">
                      {autoDetails.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Vehicle Documents
                </CardTitle>
                <CardDescription>Manage and track your vehicle documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(autoDetails.documents).map(([docName, isUploaded]) => (
                    <div key={docName} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${isUploaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {docName.charAt(0).toUpperCase() + docName.slice(1).replace(/([A-Z])/g, ' $1')}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {isUploaded ? 'Document uploaded and verified' : 'Document required'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploaded ? 'Update' : 'Upload'}
                        </Button>
                        {isUploaded && (
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Document Completion</span>
                    <span className="text-sm text-slate-600">{documentCompletion}%</span>
                  </div>
                  <Progress value={documentCompletion} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="mr-2 h-5 w-5" />
                    Service History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Service</span>
                      <span className="font-medium">{new Date(autoDetails.lastServiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Service Due</span>
                      <span className="font-medium">{new Date(autoDetails.nextServiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Interval</span>
                      <span className="font-medium">6 months</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900">Recent Services</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm">Oil Change & General Checkup</span>
                        <span className="text-xs text-slate-600">Jan 15, 2024</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm">Brake Inspection</span>
                        <span className="text-xs text-slate-600">Jul 15, 2023</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your next service is due on {new Date(autoDetails.nextServiceDate).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Service</span>
                      <span className="font-medium">{new Date(autoDetails.nextServiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Insurance Expiry</span>
                      <span className="font-medium">{new Date(autoDetails.insuranceExpiry).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pollution Certificate</span>
                      <span className="font-medium">{new Date(autoDetails.pollutionCertificate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    Book Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AutoDetails;
