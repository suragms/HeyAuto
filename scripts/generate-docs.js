#!/usr/bin/env node

/**
 * Documentation generation script
 * Generates comprehensive documentation for the HeyAuto project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating HeyAuto Documentation...\n');

// Clean previous documentation
console.log('🧹 Cleaning previous documentation...');
try {
  if (fs.existsSync('docs')) {
    fs.rmSync('docs', { recursive: true, force: true });
  }
  console.log('✅ Previous documentation cleaned\n');
} catch (error) {
  console.log('⚠️  Warning: Could not clean previous documentation:', error.message);
}

// Generate TypeDoc documentation
console.log('📚 Generating TypeDoc documentation...');
try {
  execSync('npx typedoc --out docs src --exclude "**/*.test.*" --exclude "**/node_modules/**"', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ TypeDoc documentation generated\n');
} catch (error) {
  console.error('❌ Error generating TypeDoc documentation:', error.message);
  process.exit(1);
}

// Generate component documentation
console.log('🔧 Generating component documentation...');
try {
  const componentDocs = generateComponentDocs();
  fs.writeFileSync('docs/components.md', componentDocs);
  console.log('✅ Component documentation generated\n');
} catch (error) {
  console.error('❌ Error generating component documentation:', error.message);
}

// Generate API documentation
console.log('📖 Generating API documentation...');
try {
  const apiDocs = generateAPIDocs();
  fs.writeFileSync('docs/api.md', apiDocs);
  console.log('✅ API documentation generated\n');
} catch (error) {
  console.error('❌ Error generating API documentation:', error.message);
}

// Generate deployment guide
console.log('🚀 Generating deployment guide...');
try {
  const deploymentDocs = generateDeploymentDocs();
  fs.writeFileSync('docs/deployment.md', deploymentDocs);
  console.log('✅ Deployment guide generated\n');
} catch (error) {
  console.error('❌ Error generating deployment guide:', error.message);
}

console.log('🎉 Documentation generation complete!');
console.log('📁 Documentation available in: ./docs/');
console.log('🌐 Serve documentation: npm run docs:serve');

/**
 * Generate component documentation
 */
function generateComponentDocs() {
  return `# Component Documentation

## Core Components

### BookingInterface
Main booking component that handles the complete booking flow.

**Location**: \`src/components/BookingInterface.tsx\`

**Features**:
- Three-step booking process (Input → Confirmation → Trip)
- Location detection and mapping
- Fare calculation
- Driver assignment
- OTP generation

**Props**: None (self-contained component)

**Usage**:
\`\`\`tsx
import BookingInterface from '@/components/BookingInterface';

<BookingInterface />
\`\`\`

### AuthPage
Authentication page with multiple login methods.

**Location**: \`src/components/auth/AuthPage.tsx\`

**Features**:
- Email/password login
- Phone number login
- Social authentication
- User registration
- Password recovery

**Props**: None

**Usage**:
\`\`\`tsx
import AuthPage from '@/components/auth/AuthPage';

<AuthPage />
\`\`\`

### NavigationHeader
Navigation header component with user menu.

**Location**: \`src/components/NavigationHeader.tsx\`

**Props**:
- \`currentPage\`: Current page identifier
- \`onNavigate\`: Navigation handler function
- \`onProfileClick\`: Profile click handler

**Usage**:
\`\`\`tsx
import NavigationHeader from '@/components/NavigationHeader';

<NavigationHeader 
  currentPage="home"
  onNavigate={handleNavigate}
  onProfileClick={handleProfileClick}
/>
\`\`\`

## Admin Components

### AdminDashboard
Main admin dashboard with user and driver management.

**Location**: \`src/components/admin/AdminDashboard.tsx\`

**Features**:
- User management
- Driver management
- Data export
- Real-time statistics

### AdminLoginForm
Admin login form component.

**Location**: \`src/components/admin/AdminLoginForm.tsx\`

**Features**:
- Admin authentication
- Form validation
- Error handling

## UI Components

All UI components are located in \`src/components/ui/\` and follow the shadcn/ui pattern.

**Available Components**:
- Button
- Card
- Input
- Dialog
- Toast
- And many more...

**Usage**:
\`\`\`tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Card>
  <Button>Click me</Button>
</Card>
\`\`\`
`;
}

/**
 * Generate API documentation
 */
function generateAPIDocs() {
  return `# API Documentation

## Authentication Hooks

### useAuth()
Main authentication hook for user management.

**Location**: \`src/hooks/useAuth.ts\`

**Returns**:
- \`user\`: Current user object or null
- \`isAuthenticated\`: Boolean authentication state
- \`isLoading\`: Loading state
- \`login(email, password)\`: Login function
- \`logout()\`: Logout function
- \`register(name, email, phone, password)\`: Registration function
- \`updateProfile(updates)\`: Profile update function
- \`resetPassword(email)\`: Password reset function

**Usage**:
\`\`\`tsx
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log('User:', user?.name);
}
\`\`\`

### useDriverAuth()
Driver-specific authentication hook.

**Location**: \`src/hooks/useDriverAuth.ts\`

**Returns**:
- \`driver\`: Current driver object or null
- \`isAuthenticated\`: Boolean authentication state
- \`loginDriver(phone, password)\`: Driver login function
- \`logoutDriver()\`: Driver logout function

**Usage**:
\`\`\`tsx
import { useDriverAuth } from '@/hooks/useDriverAuth';

const { driver, loginDriver, logoutDriver } = useDriverAuth();
\`\`\`

## Utility Functions

### cn(...inputs)
Merge Tailwind CSS classes efficiently.

**Location**: \`src/lib/utils.ts\`

**Parameters**:
- \`...inputs\`: Class values to merge

**Returns**: \`string\` - Merged class string

**Usage**:
\`\`\`tsx
import { cn } from '@/lib/utils';

const className = cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive });
\`\`\`

### useIsMobile()
Detect mobile viewport.

**Location**: \`src/hooks/use-mobile.tsx\`

**Returns**: \`boolean\` - True if viewport is mobile-sized

**Usage**:
\`\`\`tsx
import { useIsMobile } from '@/hooks/use-mobile';

const isMobile = useIsMobile();

return (
  <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
    Content
  </div>
);
\`\`\`

## Database Operations

### database
Database utility for data operations.

**Location**: \`src/lib/database.ts\`

**Methods**:
- \`getAllUsers()\`: Get all users
- \`getUserById(id)\`: Get user by ID
- \`createUser(userData)\`: Create new user
- \`updateUser(id, updates)\`: Update user
- \`deleteUser(id)\`: Delete user
- \`getAllDrivers()\`: Get all drivers
- \`getDriverById(id)\`: Get driver by ID
- \`createDriver(driverData)\`: Create new driver
- \`updateDriver(id, updates)\`: Update driver
- \`deleteDriver(id)\`: Delete driver

**Usage**:
\`\`\`tsx
import { database } from '@/lib/database';

// Get all users
const users = await database.getAllUsers();

// Create new user
const newUser = await database.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  password: 'password123'
});
\`\`\`

## Context Providers

### AuthProvider
Authentication context provider.

**Location**: \`src/contexts/AuthContext.tsx\`

**Props**:
- \`children\`: React children

**Usage**:
\`\`\`tsx
import { AuthProvider } from '@/contexts/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
\`\`\`

### AdminAuthProvider
Admin authentication context provider.

**Location**: \`src/contexts/AdminAuthContext.tsx\`

**Props**:
- \`children\`: React children

**Usage**:
\`\`\`tsx
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

<AdminAuthProvider>
  <AdminApp />
</AdminAuthProvider>
\`\`\`
`;
}

/**
 * Generate deployment documentation
 */
function generateDeploymentDocs() {
  return `# Deployment Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git
- Hosting service account

## Build Process

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Build for Production
\`\`\`bash
npm run build
\`\`\`

This creates an optimized build in the \`dist/\` directory.

### 3. Test Production Build
\`\`\`bash
npm run preview
\`\`\`

## Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
   - Install Command: \`npm install\`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

### Netlify

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure Build Settings**
   - Build Command: \`npm run build\`
   - Publish Directory: \`dist\`

3. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site

### GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source as "GitHub Actions"

2. **Create Workflow**
   Create \`.github/workflows/deploy.yml\`:
   \`\`\`yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: \${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   \`\`\`

3. **Deploy**
   - Push to main branch
   - GitHub Actions will automatically deploy

### Manual Deployment

1. **Build the Project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Upload Files**
   - Upload contents of \`dist/\` folder to your hosting service
   - Ensure all files are uploaded

3. **Configure Server**
   - Set up redirects for SPA routing
   - Configure HTTPS
   - Set up custom domain if needed

## Environment Variables

Create \`.env.production\` for production environment:

\`\`\`env
VITE_API_URL=https://api.yourapp.com
VITE_MAP_API_KEY=your_map_api_key
VITE_APP_NAME=HeyAuto
\`\`\`

## Domain Configuration

### Custom Domain
1. **Purchase Domain**
   - Buy domain from registrar
   - Configure DNS settings

2. **Configure Hosting**
   - Add custom domain to hosting service
   - Update DNS records
   - Enable HTTPS

### Subdomain
1. **Create Subdomain**
   - Add subdomain in hosting service
   - Configure DNS records
   - Deploy to subdomain

## SSL Certificate

### Automatic SSL
- Most hosting services provide automatic SSL
- Enable in hosting dashboard
- Certificate will be automatically renewed

### Manual SSL
1. **Generate Certificate**
   - Use Let's Encrypt
   - Or purchase from CA

2. **Install Certificate**
   - Upload certificate files
   - Configure server to use SSL

## Performance Optimization

### Build Optimization
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Minify CSS and JavaScript

### Caching
- Set appropriate cache headers
- Use browser caching
- Implement service worker if needed

### Monitoring
- Set up error tracking
- Monitor performance metrics
- Set up uptime monitoring

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

#### Deployment Issues
- Check build output
- Verify file permissions
- Check hosting service logs
- Ensure all files are uploaded

#### Runtime Errors
- Check browser console
- Verify environment variables
- Check network requests
- Review error logs

### Getting Help
- Check hosting service documentation
- Review error logs
- Contact hosting support
- Check project issues

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Update deployment configurations
- Backup data regularly

### Monitoring
- Set up uptime monitoring
- Monitor performance metrics
- Track error rates
- Review user feedback

---

**Happy Deploying! 🚀**
`;
}
