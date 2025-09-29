# Admin Portal - HeyAuto

## Overview
The Admin Portal provides comprehensive monitoring and management capabilities for the AutoNow autorickshaw booking system. It allows administrators to view and manage users, drivers, and system statistics.

## Access Information

### Admin Credentials
- **URL**: `/admin` or `/admin/login`
- **Email**: `heyauto@admin.com`
- **Password**: `HeyAuto@7432`

### Features

#### 1. Dashboard Overview
- **Total Users**: Shows count of all registered users
- **Active Users**: Number of currently active users
- **Total Drivers**: Count of all registered drivers
- **Active Drivers**: Number of currently active drivers
- **Verified Drivers**: Count of verified drivers
- **Active Sessions**: Current logged-in sessions
- **Online Drivers**: Drivers currently online

#### 2. User Management
- View all registered users
- See user details (name, email, phone, role)
- Check user status (active/inactive)
- View last login information
- Toggle user activation status

#### 3. Driver Management
- View all registered drivers
- See driver details (name, email, phone, vehicle number)
- Check driver status (online/offline/busy)
- View verification status
- See driver ratings and total rides
- Toggle driver activation status
- Toggle driver verification status

#### 4. Real-time Data
- Live statistics updates
- Refresh button to reload data
- Automatic session management

#### 5. Data Export & API
- **Complete Data Export**: Export all users and drivers data including passwords
- **CSV Export**: Export users and drivers separately to CSV files
- **JSON Export**: Download complete dataset as JSON file
- **Password Visibility**: Toggle to show/hide passwords in tables
- **Copy to Clipboard**: Copy individual records or complete datasets
- **Data API**: Programmatic access to all data with summary statistics

## Technical Implementation

### Authentication
- Secure admin authentication with hardcoded credentials
- Session management with localStorage
- Protected routes for admin-only access
- Automatic logout functionality

### Data Management
- Integration with existing database system
- Real-time data fetching from localStorage
- User and driver status management
- Statistics calculation and display

### UI Components
- Modern, responsive design
- Tabbed interface for easy navigation
- Data tables with sorting and filtering
- Action buttons for management operations
- Loading states and error handling

## File Structure

```
src/
├── contexts/
│   └── AdminAuthContext.tsx      # Admin authentication context
├── components/admin/
│   ├── AdminLoginForm.tsx        # Admin login form
│   ├── AdminDashboard.tsx        # Main dashboard component
│   ├── AdminProtectedRoute.tsx   # Route protection
│   ├── DataExport.tsx            # Data export functionality
│   ├── DataAPI.tsx               # Data API access
│   └── DatabaseManager.tsx       # Existing database manager
└── pages/
    └── AdminPage.tsx             # Admin page routing
```

## Usage Instructions

1. **Access the Admin Portal**
   - Navigate to `/admin` in your browser
   - Or click "Admin Portal" from the user menu

2. **Login**
   - Enter the admin credentials
   - Click "Sign In"

3. **Navigate the Dashboard**
   - View statistics on the main dashboard
   - Switch between "Users" and "Drivers" tabs
   - Use the refresh button to update data

4. **Manage Users**
   - View user information in the Users tab
   - Click "Activate/Deactivate" to change user status
   - Monitor user activity and login history

5. **Manage Drivers**
   - View driver information in the Drivers tab
   - Toggle driver activation status
   - Verify/unverify drivers
   - Monitor driver ratings and performance

6. **Export Data**
   - Go to "Data Export" tab
   - Use "Show Passwords" toggle to reveal passwords
   - Export to JSON or CSV formats
   - Copy individual records or complete datasets

7. **Data API Access**
   - Go to "Data API" tab
   - Click "Fetch All Data" to load complete dataset
   - Copy specific data segments (users, drivers, or complete)
   - Download complete JSON file

8. **Logout**
   - Click the "Logout" button in the header
   - Session will be cleared automatically

## Security Features

- **Protected Routes**: Admin pages are only accessible after authentication
- **Session Management**: Automatic session validation and cleanup
- **Error Handling**: Comprehensive error handling for failed operations
- **Input Validation**: Form validation for login credentials

## Development Notes

- The admin system uses the same database structure as the main application
- All data is stored in localStorage for demo purposes
- The system is designed to be easily extensible for additional admin features
- Responsive design works on desktop and mobile devices

## Future Enhancements

- User activity logs and analytics
- Driver performance metrics
- Booking history and statistics
- System configuration management
- Backup and restore functionality
- Advanced reporting features
