import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Database, Copy, Download } from 'lucide-react';
import { database } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

/**
 * Quick users fetch component for admin dashboard
 * Provides fast user data retrieval and export functionality
 * 
 * @component
 * @returns {JSX.Element} The quick users fetch component
 * 
 * @example
 * ```tsx
 * <QuickUsersFetch />
 * ```
 */
const QuickUsersFetch: React.FC = () => {
  /** List of users fetched from database */
  const [users, setUsers] = useState<any[]>([]);
  /** Loading state during fetch operation */
  const [isLoading, setIsLoading] = useState(false);
  /** Error message to display */
  const [error, setError] = useState('');
  /** Toast notification hook */
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const usersData = await database.getUsers();
      setUsers(usersData);
      
      toast({
        title: "Success",
        description: `Fetched ${usersData.length} users successfully`
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Users data copied to clipboard"
      });
    });
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `users-data-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    
    toast({
      title: "Downloaded",
      description: "Users data downloaded successfully"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Quick Users Data Fetch
          </CardTitle>
          <CardDescription>
            Fetch all users data with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={fetchUsers} 
            disabled={isLoading}
            className="w-full"
          >
            <Users className="w-4 h-4 mr-2" />
            {isLoading ? 'Fetching...' : 'Fetch All Users Data'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {users.length > 0 && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Successfully fetched {users.length} users
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(users, null, 2))}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button 
                  onClick={downloadJSON}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sample Data Structure:</h4>
                <pre className="text-xs overflow-x-auto">
                  <code>{JSON.stringify(users[0], null, 2)}</code>
                </pre>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Complete Users Array:</h4>
                <pre className="text-xs overflow-x-auto max-h-60">
                  <code>{JSON.stringify(users, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickUsersFetch;
