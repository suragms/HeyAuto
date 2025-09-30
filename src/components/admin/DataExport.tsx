import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Copy, 
  Users, 
  Car,
  FileText,
  Database,
  RefreshCw
} from 'lucide-react';
import { database } from '@/lib/database';
import { User } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

/**
 * Driver interface for data export
 * @interface Driver
 */
interface Driver {
  /** Driver ID */
  id: string;
  /** Driver name */
  name: string;
  /** Driver email */
  email: string;
  /** Driver phone number */
  phone: string;
  /** Driver password (hashed) */
  password: string;
  /** Vehicle registration number */
  vehicleNumber: string;
  /** Type of vehicle */
  vehicleType: string;
  /** Driver license number */
  licenseNumber: string;
  /** Whether driver is active */
  isActive: boolean;
  /** Whether driver is verified */
  isVerified: boolean;
  /** Driver rating */
  rating: number;
  /** Total number of rides */
  totalRides: number;
  /** Driver status */
  status: string;
  /** Account creation date */
  createdAt: string;
  /** Last update date */
  updatedAt: string;
  /** Last login date */
  lastLoginAt?: string;
}

/**
 * Data export component for admin dashboard
 * Provides functionality to export user and driver data in various formats
 * 
 * @component
 * @returns {JSX.Element} The data export component
 * 
 * @example
 * ```tsx
 * <DataExport />
 * ```
 */
const DataExport: React.FC = () => {
  /** List of users to export */
  const [users, setUsers] = useState<User[]>([]);
  /** List of drivers to export */
  const [drivers, setDrivers] = useState<Driver[]>([]);
  /** Loading state during data fetch */
  const [isLoading, setIsLoading] = useState(true);
  /** Error message to display */
  const [error, setError] = useState('');
  /** Toast notification hook */
  const { toast } = useToast();

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [usersData, driversData] = await Promise.all([
        database.getUsers(),
        database.getDrivers()
      ]);

      setUsers(usersData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        avatar: user.avatar
      })),
      drivers: drivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        vehicleNumber: driver.vehicleNumber,
        vehicleType: driver.vehicleType,
        licenseNumber: driver.licenseNumber,
        isActive: driver.isActive,
        isVerified: driver.isVerified,
        rating: driver.rating,
        totalRides: driver.totalRides,
        status: driver.status,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
        lastLoginAt: driver.lastLoginAt
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `autonow-data-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: "Data has been exported to JSON file"
    });
  };

  const exportToCSV = (type: 'users' | 'drivers') => {
    let csvContent = '';
    let headers = '';
    let data: any[] = [];

    if (type === 'users') {
      headers = 'ID,Name,Email,Phone,Role,Is Active,Created At,Updated At,Last Login\n';
      data = users.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.role,
        user.isActive,
        user.createdAt,
        user.updatedAt,
        user.lastLoginAt || 'Never'
      ]);
    } else {
      headers = 'ID,Name,Email,Phone,Vehicle Number,Vehicle Type,License Number,Is Active,Is Verified,Rating,Total Rides,Status,Created At,Updated At,Last Login\n';
      data = drivers.map(driver => [
        driver.id,
        driver.name,
        driver.email,
        driver.phone,
        driver.vehicleNumber,
        driver.vehicleType,
        driver.licenseNumber,
        driver.isActive,
        driver.isVerified,
        driver.rating,
        driver.totalRides,
        driver.status,
        driver.createdAt,
        driver.updatedAt,
        driver.lastLoginAt || 'Never'
      ]);
    }

    csvContent = headers + data.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `autonow-${type}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} data has been exported to CSV file`
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: `${label} copied successfully`
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard"
      });
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading all data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Export & Management
          </CardTitle>
          <CardDescription>
            Export all users and drivers data including passwords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={fetchAllData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={exportToJSON} variant="default">
              <FileText className="w-4 h-4 mr-2" />
              Export All to JSON
            </Button>
            <Button onClick={() => exportToCSV('users')} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Export Users to CSV
            </Button>
            <Button onClick={() => exportToCSV('drivers')} variant="outline">
              <Car className="w-4 h-4 mr-2" />
              Export Drivers to CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users Data</CardTitle>
              <CardDescription>
                Complete user information including passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "destructive"}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(JSON.stringify(user, null, 2), 'User Data')}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Drivers Data</CardTitle>
              <CardDescription>
                Complete driver information including passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-mono text-xs">{driver.id}</TableCell>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-medium">{driver.vehicleNumber}</div>
                            <div className="text-muted-foreground">{driver.vehicleType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <Badge variant={driver.isActive ? "default" : "destructive"}>
                            {driver.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={driver.isVerified ? "default" : "secondary"}>
                            {driver.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-medium">{driver.rating.toFixed(1)}</div>
                            <div className="text-muted-foreground">({driver.totalRides} rides)</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(driver.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(JSON.stringify(driver, null, 2), 'Driver Data')}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>
            Overview of all stored data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{drivers.length}</div>
              <div className="text-sm text-muted-foreground">Total Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{drivers.filter(d => d.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Drivers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExport;
