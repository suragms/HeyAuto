import { database } from './database';

export const testDatabase = async () => {
  try {
    console.log('=== DATABASE TEST ===');
    
    // Test creating a user with originalPassword
    const testUser = await database.createUser({
      name: 'Test User',
      email: 'test@test.com',
      phone: '+91 9999999999',
      password: 'testpassword123',
      role: 'user'
    });
    
    console.log('Created test user:', testUser);
    console.log('Has originalPassword:', !!testUser.originalPassword);
    console.log('Original password value:', testUser.originalPassword);
    
    // Test creating a driver with originalPassword
    const testDriver = await database.createDriver({
      name: 'Test Driver',
      email: 'testdriver@test.com',
      phone: '+91 8888888888',
      password: 'testdriver123',
      vehicleNumber: 'TEST123',
      licenseNumber: 'TESTLIC123'
    });
    
    console.log('Created test driver:', testDriver);
    console.log('Has originalPassword:', !!testDriver.originalPassword);
    console.log('Original password value:', testDriver.originalPassword);
    
    // Fetch all users and drivers
    const allUsers = await database.getUsers();
    const allDrivers = await database.getDrivers();
    
    console.log('Total users:', allUsers.length);
    console.log('Users with originalPassword:', allUsers.filter(u => u.originalPassword).length);
    console.log('Total drivers:', allDrivers.length);
    console.log('Drivers with originalPassword:', allDrivers.filter(d => d.originalPassword).length);
    
    console.log('=== DATABASE TEST COMPLETE ===');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
};

// Run test if in browser
if (typeof window !== 'undefined') {
  // Uncomment the line below to run the test
  // testDatabase();
}
