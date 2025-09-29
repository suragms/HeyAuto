import { database } from './database';

export const createSampleData = async () => {
  try {
    // Check if data already exists
    const existingUsers = await database.getUsers();
    if (existingUsers.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    console.log('Creating sample data...');

    // Create sample users
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        password: 'password123',
        role: 'user' as const,
        avatar: 'https://via.placeholder.com/150/4285f4/ffffff?text=JD'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        password: 'password123',
        role: 'user' as const,
        avatar: 'https://via.placeholder.com/150/34d399/ffffff?text=JS'
      },
      {
        name: 'Admin User',
        email: 'admin@autonow.com',
        phone: '+91 9876543212',
        password: 'admin123',
        role: 'admin' as const,
        avatar: 'https://via.placeholder.com/150/ef4444/ffffff?text=AU'
      },
      {
        name: 'Driver Kumar',
        email: 'driver@autonow.com',
        phone: '+91 9876543213',
        password: 'driver123',
        role: 'driver' as const,
        avatar: 'https://via.placeholder.com/150/f59e0b/ffffff?text=DK'
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+91 9876543214',
        password: 'test123',
        role: 'user' as const,
        avatar: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=TU'
      }
    ];

    // Create users in database
    for (const userData of sampleUsers) {
      try {
        await database.createUser(userData);
        console.log(`Created user: ${userData.name}`);
      } catch (error) {
        console.error(`Failed to create user ${userData.name}:`, error);
      }
    }

    console.log('Sample data created successfully!');
    
    // Log database stats
    const stats = await database.getStats();
    console.log('Database stats:', stats);

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Auto-create sample data on import (for development)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  createSampleData();
}
