import { database } from './database';

export const migrateExistingData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Get existing users and drivers
    const existingUsers = await database.getUsers();
    const existingDrivers = await database.getDrivers();
    
    console.log(`Found ${existingUsers.length} users and ${existingDrivers.length} drivers to migrate`);
    
     // Check if any user/driver has originalPassword field
     const hasOriginalPasswords = existingUsers.some(user => user.originalPassword) || 
                                 existingDrivers.some(driver => driver.originalPassword);
     
     if (existingUsers.length > 0 || existingDrivers.length > 0) {
       if (!hasOriginalPasswords) {
         console.log('Clearing existing data for migration (no originalPassword field found)...');
         
         // Clear existing data
         localStorage.removeItem('autonow_db_users');
         localStorage.removeItem('autonow_db_drivers');
         localStorage.removeItem('autonow_db_sessions');
         localStorage.removeItem('autonow_db_driver_sessions');
         
         console.log('Data cleared. Sample data will be recreated on next load.');
       } else {
         console.log('Data already migrated (originalPassword field found).');
       }
     } else {
       console.log('No existing data found.');
     }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Run migration if needed
if (typeof window !== 'undefined') {
  // Only run in browser environment
  migrateExistingData();
}
