/**
 * User interface representing a user in the system
 * @interface User
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's phone number */
  phone: string;
  /** Hashed password */
  password: string;
  /** Original password for admin access (optional) */
  originalPassword?: string;
  /** User's avatar URL (optional) */
  avatar?: string;
  /** Account creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Last login timestamp (optional) */
  lastLoginAt?: string;
  /** Whether account is active */
  isActive: boolean;
  /** User role */
  role: 'user' | 'admin' | 'driver';
}

/**
 * User session interface representing an active user session
 * @interface UserSession
 */
export interface UserSession {
  /** Unique session identifier */
  id: string;
  /** User ID this session belongs to */
  userId: string;
  /** Session token */
  token: string;
  /** Session creation timestamp */
  createdAt: string;
  /** Session expiration timestamp */
  expiresAt: string;
  /** Whether session is active */
  isActive: boolean;
  /** User agent string (optional) */
  userAgent?: string;
  /** IP address (optional) */
  ipAddress?: string;
}

/**
 * Password reset interface for password reset tokens
 * @interface PasswordReset
 */
export interface PasswordReset {
  /** Unique reset token identifier */
  id: string;
  /** User ID this reset token belongs to */
  userId: string;
  /** Reset token */
  token: string;
  /** Token creation timestamp */
  createdAt: string;
  /** Token expiration timestamp */
  expiresAt: string;
  /** Whether token has been used */
  isUsed: boolean;
}

/**
 * Database statistics interface
 * @interface DatabaseStats
 */
export interface DatabaseStats {
  /** Total number of users */
  totalUsers: number;
  /** Number of active users */
  activeUsers: number;
  /** Total number of sessions */
  totalSessions: number;
  /** Last backup timestamp (optional) */
  lastBackup?: string;
}

/**
 * Database configuration interface
 * @interface DatabaseConfig
 */
export interface DatabaseConfig {
  /** Database version */
  version: string;
  /** Last update timestamp */
  lastUpdated: string;
  /** Encryption key (optional) */
  encryptionKey?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  originalPassword?: string; // Original password for admin access
  vehicleNumber: string;
  licenseNumber: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalRides: number;
  status: 'available' | 'busy' | 'offline';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DriverSession {
  id: string;
  driverId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  userAgent?: string;
  ipAddress?: string;
}

export interface RideRequest {
  id: string;
  userId: string;
  driverId?: string;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  estimatedTime: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  userPhone: string;
  userNotes?: string;
}

export interface Earnings {
  id: string;
  driverId: string;
  date: string;
  totalEarnings: number;
  totalRides: number;
  totalDistance: number;
  averageFare: number;
  rides: RideRequest[];
}