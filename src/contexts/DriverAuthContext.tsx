import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { database } from '@/lib/database';
import { Driver } from '@/types/database';

/**
 * Driver authentication context interface providing driver management and authentication methods
 * @interface DriverAuthContextType
 */
interface DriverAuthContextType {
  /** Current authenticated driver or null if not logged in */
  driver: Driver | null;
  /** Loading state for authentication operations */
  isLoading: boolean;
  /** Boolean indicating if driver is currently authenticated */
  isAuthenticated: boolean;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Login with phone number and password */
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  /** Register a new driver account */
  register: (driverData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    vehicleNumber: string;
    licenseNumber: string;
  }) => Promise<boolean>;
  /** Logout current driver */
  logout: () => void;
  /** Update driver profile information */
  updateProfile: (updates: Partial<Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'password'>>) => Promise<boolean>;
  /** Change driver password */
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  /** Update driver status (available, busy, offline) */
  updateStatus: (status: 'available' | 'busy' | 'offline') => Promise<boolean>;
  /** Update driver location coordinates */
  updateLocation: (latitude: number, longitude: number) => Promise<boolean>;
}

const DriverAuthContext = createContext<DriverAuthContextType | undefined>(undefined);

/**
 * Driver authentication provider component that manages driver authentication state
 * Provides driver authentication methods and driver data to child components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} The driver authentication provider component
 * 
 * @example
 * ```tsx
 * <DriverAuthProvider>
 *   <DriverApp />
 * </DriverAuthProvider>
 * ```
 */
export const DriverAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /** Current authenticated driver state */
  const [driver, setDriver] = useState<Driver | null>(null);
  /** Loading state for authentication operations */
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('DriverAuthContext: Checking authentication...');
      try {
        const savedDriver = localStorage.getItem('auth_driver');
        console.log('DriverAuthContext: Saved driver in localStorage:', savedDriver);
        if (savedDriver) {
          const driverData = JSON.parse(savedDriver);
          console.log('DriverAuthContext: Parsed driver data:', driverData);
          // Verify driver still exists in database
          const dbDriver = await database.getDriverById(driverData.id);
          console.log('DriverAuthContext: Driver from database:', dbDriver);
          if (dbDriver && dbDriver.isActive) {
            console.log('DriverAuthContext: Setting authenticated driver');
            setDriver(dbDriver);
          } else {
            console.log('DriverAuthContext: Driver not found or inactive, clearing session');
            // Driver no longer exists or is inactive, clear session
            localStorage.removeItem('auth_driver');
          }
        } else {
          console.log('DriverAuthContext: No saved driver found');
        }
      } catch (error) {
        console.error('DriverAuthContext: Error checking driver auth:', error);
        localStorage.removeItem('auth_driver');
      } finally {
        console.log('DriverAuthContext: Authentication check complete');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('DriverAuthContext: Starting login process');
    setIsLoading(true);
    
    try {
      console.log('DriverAuthContext: Calling database.authenticateDriver');
      const authenticatedDriver = await database.authenticateDriver(email, password);
      console.log('DriverAuthContext: Authentication result:', authenticatedDriver ? 'Success' : 'Failed');
      
      if (authenticatedDriver) {
        console.log('DriverAuthContext: Creating driver session');
        // Create session
        await database.createDriverSession(authenticatedDriver.id);
        
        // Remove password from driver data before storing
        const { password: _, ...driverData } = authenticatedDriver;
        console.log('DriverAuthContext: Setting driver data:', driverData);
        setDriver(driverData);
        localStorage.setItem('auth_driver', JSON.stringify(driverData));
        console.log('DriverAuthContext: Login successful, driver set:', driverData);
        return true;
      }
      
      console.log('DriverAuthContext: Login failed - no authenticated driver');
      return false;
    } catch (error) {
      console.error('DriverAuthContext: Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const authenticatedDriver = await database.authenticateDriverByPhone(phone, password);
      
      if (authenticatedDriver) {
        // Create session
        await database.createDriverSession(authenticatedDriver.id);
        
        // Remove password from driver data before storing
        const { password: _, ...driverData } = authenticatedDriver;
        setDriver(driverData);
        localStorage.setItem('auth_driver', JSON.stringify(driverData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Driver phone login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (driverData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    vehicleNumber: string;
    licenseNumber: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newDriver = await database.createDriver(driverData);
      
      // Automatically log in the driver after successful registration
      if (newDriver) {
        // Create session
        await database.createDriverSession(newDriver.id);
        
        // Remove password from driver data before storing
        const { password: _, ...driverData } = newDriver;
        setDriver(driverData);
        localStorage.setItem('auth_driver', JSON.stringify(driverData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Driver registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (driver) {
      // Invalidate all driver sessions
      await database.invalidateDriverSessions(driver.id);
    }
    setDriver(null);
    localStorage.removeItem('auth_driver');
    // The redirect will be handled by the App component's routing logic
  };

  const updateProfile = async (updates: Partial<Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'password'>>): Promise<boolean> => {
    if (!driver) return false;
    
    setIsLoading(true);
    
    try {
      const updatedDriver = await database.updateDriver(driver.id, updates);
      
      if (updatedDriver) {
        // Remove password from driver data before storing
        const { password: _, ...driverData } = updatedDriver;
        setDriver(driverData);
        localStorage.setItem('auth_driver', JSON.stringify(driverData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Driver profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!driver) return false;
    
    setIsLoading(true);
    
    try {
      // Verify current password
      const currentDriver = await database.getDriverById(driver.id);
      if (!currentDriver) return false;
      
      // Simple password verification (in production, use proper hashing)
      const isCurrentPasswordValid = currentDriver.password === currentPassword;
      if (!isCurrentPasswordValid) return false;
      
      // Update password
      const success = await database.updateDriver(driver.id, { password: newPassword });
      return !!success;
    } catch (error) {
      console.error('Driver change password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: 'available' | 'busy' | 'offline'): Promise<boolean> => {
    if (!driver) return false;
    
    try {
      const success = await database.updateDriver(driver.id, { status });
      if (success) {
        setDriver(prev => prev ? { ...prev, status } : null);
        localStorage.setItem('auth_driver', JSON.stringify(driver ? { ...driver, status } : null));
      }
      return !!success;
    } catch (error) {
      console.error('Driver status update error:', error);
      return false;
    }
  };

  const updateLocation = async (latitude: number, longitude: number): Promise<boolean> => {
    if (!driver) return false;
    
    try {
      const success = await database.updateDriver(driver.id, { 
        location: { latitude, longitude } 
      });
      if (success) {
        setDriver(prev => prev ? { 
          ...prev, 
          location: { latitude, longitude } 
        } : null);
        localStorage.setItem('auth_driver', JSON.stringify(driver ? { 
          ...driver, 
          location: { latitude, longitude } 
        } : null));
      }
      return !!success;
    } catch (error) {
      console.error('Driver location update error:', error);
      return false;
    }
  };

  const value: DriverAuthContextType = {
    driver,
    isLoading,
    isAuthenticated: !!driver,
    login,
    loginWithPhone,
    register,
    logout,
    updateProfile,
    changePassword,
    updateStatus,
    updateLocation
  };

  return (
    <DriverAuthContext.Provider value={value}>
      {children}
    </DriverAuthContext.Provider>
  );
};

export const useDriverAuth = (): DriverAuthContextType => {
  const context = useContext(DriverAuthContext);
  if (context === undefined) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return context;
};
