export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  originalPassword?: string; // Original password for admin access
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  role: 'user' | 'admin' | 'driver';
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  userAgent?: string;
  ipAddress?: string;
}

export interface PasswordReset {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  lastBackup?: string;
}

export interface DatabaseConfig {
  version: string;
  lastUpdated: string;
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