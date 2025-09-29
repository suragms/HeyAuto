import { User, UserSession, PasswordReset, DatabaseStats, DatabaseConfig, Driver, DriverSession } from '@/types/database';

// Database configuration
const DB_VERSION = '1.0.0';
const DB_PREFIX = 'autonow_db_';

// Storage keys
const USERS_KEY = `${DB_PREFIX}users`;
const SESSIONS_KEY = `${DB_PREFIX}sessions`;
const PASSWORD_RESETS_KEY = `${DB_PREFIX}password_resets`;
const CONFIG_KEY = `${DB_PREFIX}config`;
const DRIVERS_KEY = `${DB_PREFIX}drivers`;
const DRIVER_SESSIONS_KEY = `${DB_PREFIX}driver_sessions`;

// Initialize database configuration
const initializeDatabase = (): DatabaseConfig => {
  const config: DatabaseConfig = {
    version: DB_VERSION,
    lastUpdated: new Date().toISOString(),
  };
  
  try {
    const existingConfig = localStorage.getItem(CONFIG_KEY);
    if (!existingConfig) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
    return config;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return config;
  }
};

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  // Simple hash - in production use proper hashing
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36) + password.length.toString();
};

// Verify password
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate session token
const generateToken = (): string => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

class DatabaseService {
  private config: DatabaseConfig;

  constructor() {
    this.config = initializeDatabase();
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'isActive'>): Promise<User> {
    try {
      const users = await this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email || u.phone === userData.phone);
      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      const newUser: User = {
        ...userData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        password: hashPassword(userData.password),
        originalPassword: userData.password, // Store original for admin access
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const usersData = localStorage.getItem(USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.phone === phone) || null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        return null;
      }

      // Hash password if it's being updated
      if (updates.password) {
        updates.password = hashPassword(updates.password);
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Authentication operations
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user || !user.isActive) {
        return null;
      }

      if (verifyPassword(password, user.password)) {
        // Update last login
        await this.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  async authenticateUserByPhone(phone: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByPhone(phone);
      if (!user || !user.isActive) {
        return null;
      }

      if (verifyPassword(password, user.password)) {
        // Update last login
        await this.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating user by phone:', error);
      return null;
    }
  }

  // Session operations
  async createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<UserSession> {
    try {
      const sessions = await this.getSessions();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

      const newSession: UserSession = {
        id: generateId(),
        userId,
        token: generateToken(),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        userAgent,
        ipAddress,
      };

      sessions.push(newSession);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async getSessions(): Promise<UserSession[]> {
    try {
      const sessionsData = localStorage.getItem(SESSIONS_KEY);
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  async getSessionByToken(token: string): Promise<UserSession | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(session => session.token === token && session.isActive) || null;
    } catch (error) {
      console.error('Error getting session by token:', error);
      return null;
    }
  }

  async invalidateSession(token: string): Promise<boolean> {
    try {
      const sessions = await this.getSessions();
      const sessionIndex = sessions.findIndex(session => session.token === token);
      
      if (sessionIndex === -1) {
        return false;
      }

      sessions[sessionIndex].isActive = false;
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  }

  async invalidateUserSessions(userId: string): Promise<boolean> {
    try {
      const sessions = await this.getSessions();
      const updatedSessions = sessions.map(session => 
        session.userId === userId ? { ...session, isActive: false } : session
      );
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
      return true;
    } catch (error) {
      console.error('Error invalidating user sessions:', error);
      return false;
    }
  }

  // Password reset operations
  async createPasswordReset(userId: string): Promise<PasswordReset> {
    try {
      const resets = await this.getPasswordResets();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

      const newReset: PasswordReset = {
        id: generateId(),
        userId,
        token: generateToken(),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isUsed: false,
      };

      resets.push(newReset);
      localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(resets));
      
      return newReset;
    } catch (error) {
      console.error('Error creating password reset:', error);
      throw error;
    }
  }

  async getPasswordResets(): Promise<PasswordReset[]> {
    try {
      const resetsData = localStorage.getItem(PASSWORD_RESETS_KEY);
      return resetsData ? JSON.parse(resetsData) : [];
    } catch (error) {
      console.error('Error getting password resets:', error);
      return [];
    }
  }

  async getPasswordResetByToken(token: string): Promise<PasswordReset | null> {
    try {
      const resets = await this.getPasswordResets();
      return resets.find(reset => reset.token === token && !reset.isUsed) || null;
    } catch (error) {
      console.error('Error getting password reset by token:', error);
      return null;
    }
  }

  async usePasswordReset(token: string, newPassword: string): Promise<boolean> {
    try {
      const reset = await this.getPasswordResetByToken(token);
      if (!reset) {
        return false;
      }

      // Check if reset is expired
      if (new Date() > new Date(reset.expiresAt)) {
        return false;
      }

      // Update user password
      const success = await this.updateUser(reset.userId, { password: newPassword });
      if (!success) {
        return false;
      }

      // Mark reset as used
      const resets = await this.getPasswordResets();
      const resetIndex = resets.findIndex(r => r.id === reset.id);
      if (resetIndex !== -1) {
        resets[resetIndex].isUsed = true;
        localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(resets));
      }

      return true;
    } catch (error) {
      console.error('Error using password reset:', error);
      return false;
    }
  }

  // Database statistics
  async getStats(): Promise<DatabaseStats> {
    try {
      const users = await this.getUsers();
      const sessions = await this.getSessions();
      
      return {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive).length,
        totalSessions: sessions.filter(session => session.isActive).length,
        lastBackup: this.config.lastUpdated,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalSessions: 0,
      };
    }
  }

  // Backup and restore
  async backupData(): Promise<string> {
    try {
      const users = await this.getUsers();
      const sessions = await this.getSessions();
      const resets = await this.getPasswordResets();
      
      const backup = {
        version: DB_VERSION,
        timestamp: new Date().toISOString(),
        users,
        sessions,
        resets,
        config: this.config,
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async restoreData(backupData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(backupData);
      
      if (backup.version !== DB_VERSION) {
        throw new Error('Backup version mismatch');
      }

      localStorage.setItem(USERS_KEY, JSON.stringify(backup.users || []));
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(backup.sessions || []));
      localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(backup.resets || []));
      localStorage.setItem(CONFIG_KEY, JSON.stringify(backup.config || this.config));

      return true;
    } catch (error) {
      console.error('Error restoring data:', error);
      return false;
    }
  }

  // Driver operations
  async createDriver(driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'isActive' | 'isVerified' | 'rating' | 'totalRides' | 'status'>): Promise<Driver> {
    try {
      const drivers = await this.getDrivers();
      
      // Check if driver already exists
      const existingDriver = drivers.find(d => d.email === driverData.email || d.phone === driverData.phone || d.vehicleNumber === driverData.vehicleNumber);
      if (existingDriver) {
        throw new Error('Driver with this email, phone, or vehicle number already exists');
      }

      const newDriver: Driver = {
        ...driverData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isVerified: false,
        rating: 0,
        totalRides: 0,
        status: 'offline',
        password: hashPassword(driverData.password),
        originalPassword: driverData.password, // Store original for admin access
      };

      drivers.push(newDriver);
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
      
      return newDriver;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  async getDrivers(): Promise<Driver[]> {
    try {
      const driversData = localStorage.getItem(DRIVERS_KEY);
      return driversData ? JSON.parse(driversData) : [];
    } catch (error) {
      console.error('Error getting drivers:', error);
      return [];
    }
  }

  async getDriverById(id: string): Promise<Driver | null> {
    try {
      const drivers = await this.getDrivers();
      return drivers.find(driver => driver.id === id) || null;
    } catch (error) {
      console.error('Error getting driver by ID:', error);
      return null;
    }
  }

  async getDriverByEmail(email: string): Promise<Driver | null> {
    try {
      const drivers = await this.getDrivers();
      return drivers.find(driver => driver.email === email) || null;
    } catch (error) {
      console.error('Error getting driver by email:', error);
      return null;
    }
  }

  async getDriverByPhone(phone: string): Promise<Driver | null> {
    try {
      const drivers = await this.getDrivers();
      return drivers.find(driver => driver.phone === phone) || null;
    } catch (error) {
      console.error('Error getting driver by phone:', error);
      return null;
    }
  }

  async getDriverByVehicleNumber(vehicleNumber: string): Promise<Driver | null> {
    try {
      const drivers = await this.getDrivers();
      return drivers.find(driver => driver.vehicleNumber === vehicleNumber) || null;
    } catch (error) {
      console.error('Error getting driver by vehicle number:', error);
      return null;
    }
  }

  async updateDriver(id: string, updates: Partial<Omit<Driver, 'id' | 'createdAt'>>): Promise<Driver | null> {
    try {
      const drivers = await this.getDrivers();
      const driverIndex = drivers.findIndex(driver => driver.id === id);
      
      if (driverIndex === -1) {
        return null;
      }

      // Hash password if it's being updated
      if (updates.password) {
        updates.password = hashPassword(updates.password);
      }

      drivers[driverIndex] = {
        ...drivers[driverIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
      return drivers[driverIndex];
    } catch (error) {
      console.error('Error updating driver:', error);
      return null;
    }
  }

  async deleteDriver(id: string): Promise<boolean> {
    try {
      const drivers = await this.getDrivers();
      const filteredDrivers = drivers.filter(driver => driver.id !== id);
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(filteredDrivers));
      return true;
    } catch (error) {
      console.error('Error deleting driver:', error);
      return false;
    }
  }

  // Driver authentication operations
  async authenticateDriver(email: string, password: string): Promise<Driver | null> {
    try {
      console.log('Database: Looking for driver with email:', email);
      const driver = await this.getDriverByEmail(email);
      console.log('Database: Found driver:', driver ? 'Yes' : 'No');
      
      if (!driver || !driver.isActive) {
        console.log('Database: Driver not found or inactive');
        return null;
      }

      console.log('Database: Verifying password');
      const passwordValid = verifyPassword(password, driver.password);
      console.log('Database: Password valid:', passwordValid);

      if (passwordValid) {
        console.log('Database: Password verified, updating last login');
        // Update last login
        await this.updateDriver(driver.id, { lastLoginAt: new Date().toISOString() });
        console.log('Database: Authentication successful');
        return driver;
      }

      console.log('Database: Password verification failed');
      return null;
    } catch (error) {
      console.error('Database: Error authenticating driver:', error);
      return null;
    }
  }

  async authenticateDriverByPhone(phone: string, password: string): Promise<Driver | null> {
    try {
      const driver = await this.getDriverByPhone(phone);
      if (!driver || !driver.isActive) {
        return null;
      }

      if (verifyPassword(password, driver.password)) {
        // Update last login
        await this.updateDriver(driver.id, { lastLoginAt: new Date().toISOString() });
        return driver;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating driver by phone:', error);
      return null;
    }
  }

  // Driver session operations
  async createDriverSession(driverId: string, userAgent?: string, ipAddress?: string): Promise<DriverSession> {
    try {
      const sessions = await this.getDriverSessions();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

      const newSession: DriverSession = {
        id: generateId(),
        driverId,
        token: generateToken(),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        userAgent,
        ipAddress,
      };

      sessions.push(newSession);
      localStorage.setItem(DRIVER_SESSIONS_KEY, JSON.stringify(sessions));
      
      return newSession;
    } catch (error) {
      console.error('Error creating driver session:', error);
      throw error;
    }
  }

  async getDriverSessions(): Promise<DriverSession[]> {
    try {
      const sessionsData = localStorage.getItem(DRIVER_SESSIONS_KEY);
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Error getting driver sessions:', error);
      return [];
    }
  }

  async getDriverSessionByToken(token: string): Promise<DriverSession | null> {
    try {
      const sessions = await this.getDriverSessions();
      return sessions.find(session => session.token === token && session.isActive) || null;
    } catch (error) {
      console.error('Error getting driver session by token:', error);
      return null;
    }
  }

  async invalidateDriverSession(token: string): Promise<boolean> {
    try {
      const sessions = await this.getDriverSessions();
      const sessionIndex = sessions.findIndex(session => session.token === token);
      
      if (sessionIndex === -1) {
        return false;
      }

      sessions[sessionIndex].isActive = false;
      localStorage.setItem(DRIVER_SESSIONS_KEY, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Error invalidating driver session:', error);
      return false;
    }
  }

  async invalidateDriverSessions(driverId: string): Promise<boolean> {
    try {
      const sessions = await this.getDriverSessions();
      const updatedSessions = sessions.map(session => 
        session.driverId === driverId ? { ...session, isActive: false } : session
      );
      localStorage.setItem(DRIVER_SESSIONS_KEY, JSON.stringify(updatedSessions));
      return true;
    } catch (error) {
      console.error('Error invalidating driver sessions:', error);
      return false;
    }
  }

  // Cleanup expired data
  async cleanupExpiredData(): Promise<void> {
    try {
      const now = new Date();
      
      // Clean up expired sessions
      const sessions = await this.getSessions();
      const activeSessions = sessions.filter(session => 
        session.isActive && new Date(session.expiresAt) > now
      );
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(activeSessions));

      // Clean up expired driver sessions
      const driverSessions = await this.getDriverSessions();
      const activeDriverSessions = driverSessions.filter(session => 
        session.isActive && new Date(session.expiresAt) > now
      );
      localStorage.setItem(DRIVER_SESSIONS_KEY, JSON.stringify(activeDriverSessions));

      // Clean up expired password resets
      const resets = await this.getPasswordResets();
      const activeResets = resets.filter(reset => 
        !reset.isUsed && new Date(reset.expiresAt) > now
      );
      localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(activeResets));

      // Update config
      this.config.lastUpdated = new Date().toISOString();
      localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Error cleaning up expired data:', error);
    }
  }
}

// Export singleton instance
export const database = new DatabaseService();

// Initialize cleanup on startup
database.cleanupExpiredData();
