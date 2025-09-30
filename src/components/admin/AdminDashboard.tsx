import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserCheck, 
  Car, 
  CarIcon, 
  Activity, 
  LogOut, 
  RefreshCw,
  Ban,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { database } from '@/lib/database';
import { User } from '@/types/database';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import DataExport from './DataExport';
import DataAPI from './DataAPI';
import UsersDataFetcher from './UsersDataFetcher';
import UsersAPI from './UsersAPI';
import QuickUsersFetch from './QuickUsersFetch';

/**
 * Dashboard statistics interface
 * @interface DashboardStats
 */
interface DashboardStats {
  /** Total number of users */
  totalUsers: number;
  /** Number of active users */
  activeUsers: number;
  /** Total number of drivers */
  totalDrivers: number;
  /** Number of active drivers */
  activeDrivers: number;
  /** Number of verified drivers */
  verifiedDrivers: number;
  /** Total number of sessions */
  totalSessions: number;
  /** Number of online drivers */
  onlineDrivers: number;
}

/**
 * Admin dashboard component for system management
 * Provides overview statistics, user management, and data export functionality
 * 
 * @component
 * @returns {JSX.Element} The admin dashboard component
 * 
 * @example
 * ```tsx
 * <AdminDashboard />
 * ```
 */
const AdminDashboard: React.FC = () => {
  /** Admin authentication context */
  const { admin, logout } = useAdminAuth();
  /** Dashboard statistics */
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    verifiedDrivers: 0,
    totalSessions: 0,
    onlineDrivers: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

       // Fetch users and drivers data
       const [usersData, driversData, dbStats] = await Promise.all([
         database.getUsers(),
         database.getDrivers(),
         database.getStats()
       ]);


       setUsers(usersData);
       setDrivers(driversData);

      // Calculate driver stats
      const activeDrivers = driversData.filter(d => d.isActive).length;
      const verifiedDrivers = driversData.filter(d => d.isVerified).length;
      const onlineDrivers = driversData.filter(d => d.status === 'online').length;

      setStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(u => u.isActive).length,
        totalDrivers: driversData.length,
        activeDrivers,
        verifiedDrivers,
        totalSessions: dbStats.totalSessions,
        onlineDrivers
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await database.updateUser(userId, { isActive: !currentStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    }
  };

  const handleDriverToggleStatus = async (driverId: string, currentStatus: boolean) => {
    try {
      await database.updateDriver(driverId, { isActive: !currentStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating driver status:', error);
      setError('Failed to update driver status');
    }
  };

  const handleDriverToggleVerification = async (driverId: string, currentVerification: boolean) => {
    try {
      await database.updateDriver(driverId, { isVerified: !currentVerification });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating driver verification:', error);
      setError('Failed to update driver verification');
    }
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


  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <Ban className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getDriverStatusBadge = (status: string) => {
    const statusConfig = {
      online: { variant: 'default' as const, className: 'bg-green-100 text-green-800', icon: CheckCircle },
      offline: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800', icon: Clock },
      busy: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800', icon: Activity }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {admin?.name}</p>
            </div>
             <div className="flex items-center gap-4">
               <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                 <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
               <Button variant="outline" onClick={logout}>
                 <LogOut className="w-4 h-4 mr-2" />
                 Logout
               </Button>
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeDrivers} active, {stats.onlineDrivers} online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Drivers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalDrivers > 0 ? Math.round((stats.verifiedDrivers / stats.totalDrivers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Currently logged in
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
         <Tabs defaultValue="users" className="space-y-6">
           <TabsList>
             <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
             <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
             <TabsTrigger value="all-users">All Users Data</TabsTrigger>
             <TabsTrigger value="quick-fetch">Quick Fetch</TabsTrigger>
             <TabsTrigger value="export">Data Export</TabsTrigger>
             <TabsTrigger value="api">Data API</TabsTrigger>
           </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Name</TableHead>
                       <TableHead>Email</TableHead>
                       <TableHead>Phone</TableHead>
                       <TableHead>Role</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Last Login</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                        <TableCell>
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserToggleStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>
                  Manage driver accounts, verification, and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Name</TableHead>
                       <TableHead>Email</TableHead>
                       <TableHead>Phone</TableHead>
                       <TableHead>Vehicle</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Verified</TableHead>
                       <TableHead>Rating</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CarIcon className="w-4 h-4" />
                            <span className="font-mono text-sm">{driver.vehicleNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getDriverStatusBadge(driver.status)}</TableCell>
                        <TableCell>
                          <Badge variant={driver.isVerified ? 'default' : 'secondary'}>
                            {driver.isVerified ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{driver.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({driver.totalRides})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDriverToggleStatus(driver.id, driver.isActive)}
                            >
                              {driver.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDriverToggleVerification(driver.id, driver.isVerified)}
                            >
                              {driver.isVerified ? 'Unverify' : 'Verify'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="all-users" className="space-y-4">
             <UsersDataFetcher />
           </TabsContent>

           <TabsContent value="quick-fetch" className="space-y-4">
             <QuickUsersFetch />
           </TabsContent>

           <TabsContent value="export" className="space-y-4">
             <DataExport />
           </TabsContent>

           <TabsContent value="api" className="space-y-4">
             <DataAPI />
           </TabsContent>
         </Tabs>
       </div>
     </div>
   );
 };

 export default AdminDashboard;
