import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Admin user interface
 * @interface AdminUser
 */
interface AdminUser {
  /** Unique admin identifier */
  id: string;
  /** Admin email address */
  email: string;
  /** Admin name */
  name: string;
  /** Admin role (always 'admin') */
  role: 'admin';
  /** Whether admin account is active */
  isActive: boolean;
}

/**
 * Admin authentication context interface providing admin management and authentication methods
 * @interface AdminAuthContextType
 */
interface AdminAuthContextType {
  /** Current authenticated admin or null if not logged in */
  admin: AdminUser | null;
  /** Loading state for authentication operations */
  isLoading: boolean;
  /** Boolean indicating if admin is currently authenticated */
  isAuthenticated: boolean;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Logout current admin */
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

/**
 * Admin authentication provider component that manages admin authentication state
 * Provides admin authentication methods and admin data to child components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} The admin authentication provider component
 * 
 * @example
 * ```tsx
 * <AdminAuthProvider>
 *   <AdminApp />
 * </AdminAuthProvider>
 * ```
 */
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /** Current authenticated admin state */
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  /** Loading state for authentication operations */
  const [isLoading, setIsLoading] = useState(true);

  // Admin credentials (hardcoded as requested)
  const ADMIN_EMAIL = 'heyauto@admin.com';
  const ADMIN_PASSWORD = 'HeyAuto@7432';

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedAdmin = localStorage.getItem('admin_user');
        if (savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          if (adminData.email === ADMIN_EMAIL && adminData.isActive) {
            setAdmin(adminData);
          } else {
            localStorage.removeItem('admin_user');
          }
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData: AdminUser = {
          id: 'admin_001',
          email: ADMIN_EMAIL,
          name: 'HeyAuto Admin',
          role: 'admin',
          isActive: true
        };
        
        setAdmin(adminData);
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
  };

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
