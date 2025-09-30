import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { database } from '@/lib/database';
import { User } from '@/types/database';

/**
 * Authentication context interface providing user management and authentication methods
 * @interface AuthContextType
 */
interface AuthContextType {
  /** Current authenticated user or null if not logged in */
  user: User | null;
  /** Loading state for authentication operations */
  isLoading: boolean;
  /** Boolean indicating if user is currently authenticated */
  isAuthenticated: boolean;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Login with phone number and password */
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  /** Register a new user account */
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  /** Logout current user */
  logout: () => void;
  /** Update user profile information */
  updateProfile: (updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password'>>) => Promise<boolean>;
  /** Reset user password via email */
  resetPassword: (email: string) => Promise<boolean>;
  /** Verify OTP for phone number authentication */
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  /** Send OTP to phone number */
  sendOTP: (phone: string) => Promise<boolean>;
  /** Login with Google OAuth */
  loginWithGoogle: () => Promise<boolean>;
  /** Login with GitHub OAuth */
  loginWithGithub: () => Promise<boolean>;
  /** Change user password */
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  /** Get database statistics */
  getDatabaseStats: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component that manages user authentication state
 * Provides authentication methods and user data to child components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} The authentication provider component
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /** Current authenticated user state */
  const [user, setUser] = useState<User | null>(null);
  /** Loading state for authentication operations */
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Verify user still exists in database
          const dbUser = await database.getUserById(userData.id);
          if (dbUser && dbUser.isActive) {
            setUser(dbUser);
          } else {
            // User no longer exists or is inactive, clear session
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const authenticatedUser = await database.authenticateUser(email, password);
      
      if (authenticatedUser) {
        // Create session
        await database.createSession(authenticatedUser.id);
        
        // Remove password from user data before storing
        const { password: _, ...userData } = authenticatedUser;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const authenticatedUser = await database.authenticateUserByPhone(phone, password);
      
      if (authenticatedUser) {
        // Create session
        await database.createSession(authenticatedUser.id);
        
        // Remove password from user data before storing
        const { password: _, ...userData } = authenticatedUser;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Phone login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newUser = await database.createUser({
        name,
        email,
        phone,
        password,
        role: 'user'
      });
      
      // Don't automatically log in the user - just create the account
      // User will need to log in manually
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user) {
      // Invalidate all user sessions
      await database.invalidateUserSessions(user.id);
    }
    setUser(null);
    localStorage.removeItem('auth_user');
    // The redirect will be handled by the App component's routing logic
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password'>>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const updatedUser = await database.updateUser(user.id, updates);
      
      if (updatedUser) {
        // Remove password from user data before storing
        const { password: _, ...userData } = updatedUser;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const user = await database.getUserByEmail(email);
      if (user) {
        await database.createPasswordReset(user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const user = await database.getUserByPhone(phone);
      if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`otp_${phone}`, otp);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const storedOTP = localStorage.getItem(`otp_${phone}`);
      if (storedOTP === otp) {
        const user = await database.getUserByPhone(phone);
        if (user && user.isActive) {
          // Create session
          await database.createSession(user.id);
          
          // Remove password from user data before storing
          const { password: _, ...userData } = user;
          setUser(userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          localStorage.removeItem(`otp_${phone}`); // Clear OTP after successful login
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if Google user already exists
      let googleUser = await database.getUserByEmail('google.user@example.com');
      
      if (!googleUser) {
        // Create a Google user
        googleUser = await database.createUser({
          name: 'Google User',
          email: 'google.user@example.com',
          phone: '+91 9876543212',
          password: 'google_password',
          role: 'user',
          avatar: 'https://via.placeholder.com/150/4285f4/ffffff?text=G'
        });
      }
      
      // Create session
      await database.createSession(googleUser.id);
      
      // Remove password from user data before storing
      const { password: _, ...userData } = googleUser;
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if GitHub user already exists
      let githubUser = await database.getUserByEmail('github.user@example.com');
      
      if (!githubUser) {
        // Create a GitHub user
        githubUser = await database.createUser({
          name: 'GitHub User',
          email: 'github.user@example.com',
          phone: '+91 9876543213',
          password: 'github_password',
          role: 'user',
          avatar: 'https://via.placeholder.com/150/333333/ffffff?text=GH'
        });
      }
      
      // Create session
      await database.createSession(githubUser.id);
      
      // Remove password from user data before storing
      const { password: _, ...userData } = githubUser;
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('GitHub login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Verify current password
      const currentUser = await database.getUserById(user.id);
      if (!currentUser) return false;
      
      // Simple password verification (in production, use proper hashing)
      const isCurrentPasswordValid = currentUser.password === currentPassword;
      if (!isCurrentPasswordValid) return false;
      
      // Update password
      const success = await database.updateUser(user.id, { password: newPassword });
      return !!success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getDatabaseStats = async () => {
    try {
      return await database.getStats();
    } catch (error) {
      console.error('Get database stats error:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithPhone,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyOTP,
    sendOTP,
    loginWithGoogle,
    loginWithGithub,
    changePassword,
    getDatabaseStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
