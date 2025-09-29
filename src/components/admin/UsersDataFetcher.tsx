import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Copy, 
  Users, 
  RefreshCw,
  Database,
  FileText,
  CheckCircle,
  Ban,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';
import { database } from '@/lib/database';
import { User } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const UsersDataFetcher: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    regularUsers: 0,
    drivers: 0
  });
  const { toast } = useToast();

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const usersData = await database.getUsers();
      
      // Calculate statistics
      const total = usersData.length;
      const active = usersData.filter(u => u.isActive).length;
      const inactive = total - active;
      const admins = usersData.filter(u => u.role === 'admin').length;
      const regularUsers = usersData.filter(u => u.role === 'user').length;
      const drivers = usersData.filter(u => u.role === 'driver').length;

      setUsers(usersData);
      setStats({ total, active, inactive, admins, regularUsers, drivers });

      console.log('Fetched all users:', usersData);
      toast({
        title: "Data Fetched Successfully",
        description: `Retrieved ${total} users from database`
      });

    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users data');
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalUsers: users.length,
      statistics: stats,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `all-users-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: "All users data exported to JSON file"
    });
  };

  const exportToCSV = () => {
    const headers = 'ID,Name,Email,Phone,Role,Is Active,Avatar,Created At,Updated At,Last Login\n';
    
    const csvData = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.isActive ? 'Yes' : 'No',
      user.avatar || 'No Avatar',
      user.createdAt,
      user.updatedAt,
      user.lastLoginAt || 'Never'
    ]);

    const csvContent = headers + csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all-users-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "All users data exported to CSV file"
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
        description: "Failed to copy to clipboard",
        variant: "destructive"
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

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      user: { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      driver: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;

    return (
      <Badge variant={config.variant} className={config.className}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading all users data...</p>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Ban className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{stats.drivers}</div>
              <div className="text-sm text-muted-foreground">Drivers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Export All Users Data
          </CardTitle>
          <CardDescription>
            Download or copy all users information in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={fetchAllUsers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={exportToJSON} variant="default">
              <FileText className="w-4 h-4 mr-2" />
              Export to JSON
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
            <Button 
              onClick={() => copyToClipboard(JSON.stringify(users, null, 2), 'All Users Data')}
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users Data ({users.length} users)</CardTitle>
          <CardDescription>
            Complete information for all registered users
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
                  <TableHead>Avatar</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(user.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {user.lastLoginAt ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(user.lastLoginAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
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

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>
            Overview of all users data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">User Distribution:</h4>
              <ul className="text-sm space-y-1">
                <li>• Total Users: {stats.total}</li>
                <li>• Active Users: {stats.active}</li>
                <li>• Inactive Users: {stats.inactive}</li>
                <li>• Admin Users: {stats.admins}</li>
                <li>• Regular Users: {stats.regularUsers}</li>
                <li>• Driver Users: {stats.drivers}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data Information:</h4>
              <ul className="text-sm space-y-1">
                <li>• Last Updated: {new Date().toLocaleString()}</li>
                <li>• Data Source: Local Storage Database</li>
                <li>• Export Formats: JSON, CSV</li>
                <li>• Total Records: {users.length}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersDataFetcher;
