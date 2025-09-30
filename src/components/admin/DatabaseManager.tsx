import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, Upload, Trash2, RefreshCw, Database, Users, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/database';
import { DatabaseStats } from '@/types/database';

/**
 * Database manager component for admin dashboard
 * Provides database management, backup, and statistics functionality
 * 
 * @component
 * @returns {JSX.Element} The database manager component
 * 
 * @example
 * ```tsx
 * <DatabaseManager />
 * ```
 */
const DatabaseManager: React.FC = () => {
  /** User authentication context */
  const { user, getDatabaseStats } = useAuth();
  /** Database statistics */
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  /** Loading state during operations */
  const [isLoading, setIsLoading] = useState(false);
  /** Error message to display */
  const [error, setError] = useState('');
  /** Success message to display */
  const [success, setSuccess] = useState('');
  /** Backup data for export */
  const [backupData, setBackupData] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const statsData = await getDatabaseStats();
      setStats(statsData);
    } catch (error) {
      setError('Failed to load database statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const backup = await database.backupData();
      setBackupData(backup);
      setSuccess('Database backup created successfully');
    } catch (error) {
      setError('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!backupData.trim()) {
      setError('Please paste backup data first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await database.restoreData(backupData);
      if (success) {
        setSuccess('Database restored successfully');
        setBackupData('');
        await loadStats();
      } else {
        setError('Failed to restore database');
      }
    } catch (error) {
      setError('Invalid backup data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await database.cleanupExpiredData();
      setSuccess('Expired data cleaned up successfully');
      await loadStats();
    } catch (error) {
      setError('Failed to cleanup expired data');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackup = () => {
    if (!backupData) return;

    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autonow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive">
              <AlertDescription>
                Access denied. Admin privileges required.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Manager</h1>
            <p className="text-muted-foreground">Manage user data and database operations</p>
          </div>
          <Button onClick={loadStats} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active users
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : 'Never'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Database backup
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Database Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Backup Database
              </CardTitle>
              <CardDescription>
                Create a backup of all user data and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleBackup} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Create Backup
                  </>
                )}
              </Button>

              {backupData && (
                <div className="space-y-2">
                  <Label>Backup Data</Label>
                  <textarea
                    value={backupData}
                    readOnly
                    className="w-full h-32 p-2 border rounded-md text-xs font-mono"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={downloadBackup} size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => setBackupData('')} 
                      size="sm" 
                      variant="outline"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restore Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Restore Database
              </CardTitle>
              <CardDescription>
                Restore database from backup data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Backup Data</Label>
                <textarea
                  value={backupData}
                  onChange={(e) => setBackupData(e.target.value)}
                  placeholder="Paste backup data here..."
                  className="w-full h-32 p-2 border rounded-md text-xs font-mono"
                />
              </div>

              <Button 
                onClick={handleRestore} 
                disabled={isLoading || !backupData.trim()}
                className="w-full"
                variant="destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore Database
                  </>
                )}
              </Button>

              <Alert>
                <AlertDescription>
                  <strong>Warning:</strong> This will replace all current data with the backup data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5" />
              Database Maintenance
            </CardTitle>
            <CardDescription>
              Clean up expired sessions and temporary data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cleanup Expired Data</p>
                <p className="text-xs text-muted-foreground">
                  Remove expired sessions and password reset tokens
                </p>
              </div>
              <Button 
                onClick={handleCleanup} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>
              Current database configuration and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Storage Type</Label>
                <p className="text-sm text-muted-foreground">LocalStorage (Browser)</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Encryption</Label>
                <p className="text-sm text-muted-foreground">Basic Hashing</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Data Persistence</Label>
                <p className="text-sm text-muted-foreground">Browser Storage</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Backup Frequency</Label>
                <p className="text-sm text-muted-foreground">Manual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseManager;
