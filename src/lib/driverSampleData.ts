import { database } from './database';

// Sample driver data for testing
const sampleDrivers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@driver.com',
    phone: '+91 9876543210',
    password: 'driver123',
    vehicleNumber: 'KL 47 B 5501',
    licenseNumber: 'DL1234567890'
  },
  {
    name: 'Sunil Patel',
    email: 'sunil@driver.com',
    phone: '+91 9876543211',
    password: 'driver123',
    vehicleNumber: 'KL 47 C 1299',
    licenseNumber: 'DL1234567891'
  },
  {
    name: 'Anish Verma',
    email: 'anish@driver.com',
    phone: '+91 9876543212',
    password: 'driver123',
    vehicleNumber: 'KL 47 A 8876',
    licenseNumber: 'DL1234567892'
  },
  {
    name: 'Mahesh Tiwari',
    email: 'mahesh@driver.com',
    phone: '+91 9876543213',
    password: 'driver123',
    vehicleNumber: 'KL 47 D 2134',
    licenseNumber: 'DL1234567893'
  },
  {
    name: 'Krishnan Menon',
    email: 'krishnan@driver.com',
    phone: '+91 9876543214',
    password: 'driver123',
    vehicleNumber: 'KL 47 E 9876',
    licenseNumber: 'DL1234567894'
  }
];

// Initialize sample driver data
export const initializeDriverSampleData = async () => {
  try {
    const existingDrivers = await database.getDrivers();
    
    // Only create sample data if no drivers exist
    if (existingDrivers.length === 0) {
      console.log('Creating sample driver data...');
      
      for (const driverData of sampleDrivers) {
        try {
          await database.createDriver(driverData);
          console.log(`Created driver: ${driverData.name}`);
        } catch (error) {
          console.error(`Error creating driver ${driverData.name}:`, error);
        }
      }
      
      console.log('Sample driver data created successfully!');
      console.log('Test credentials:');
      console.log('Email: rajesh@driver.com, Password: driver123');
      console.log('Email: sunil@driver.com, Password: driver123');
      console.log('Email: anish@driver.com, Password: driver123');
    } else {
      console.log('Driver data already exists, skipping sample data creation.');
    }
  } catch (error) {
    console.error('Error initializing driver sample data:', error);
  }
};

// Auto-initialize when this module is imported
initializeDriverSampleData();
