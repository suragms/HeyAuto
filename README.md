# HeyAuto - Auto Rickshaw Booking App

A modern, full-featured auto rickshaw booking application built for Vadanappally, Kerala. This application provides a complete solution for booking auto rickshaws with real-time tracking, driver management, and user authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [API Reference](#-api-reference)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Features

### Core Features
- **Instant Booking**: Book auto rickshaws in seconds with smart matching
- **Real-time Tracking**: Live location tracking and ETA updates
- **Driver Management**: Complete driver onboarding and verification system
- **User Authentication**: Multiple login methods (email, phone, social)
- **Booking History**: Track all past and current bookings
- **Admin Dashboard**: Comprehensive admin panel for system management

### User Features
- **Multi-step Booking Flow**: Input → Confirmation → Trip tracking
- **Location Services**: GPS-based pickup location detection
- **Fare Calculation**: Dynamic fare calculation based on distance
- **OTP Verification**: Secure driver verification system
- **Profile Management**: User profile and settings management
- **Responsive Design**: Works seamlessly on mobile and desktop

### Admin Features
- **User Management**: View and manage all registered users
- **Driver Management**: Driver verification and status management
- **Data Export**: Export user and driver data in multiple formats
- **Real-time Statistics**: Live dashboard with system metrics
- **Database Management**: Complete database administration tools

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### State Management
- **React Context** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent data storage

### Maps & Location
- **Leaflet** - Interactive maps
- **Geolocation API** - GPS location services

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeDoc** - Automatic documentation generation
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # User authentication
│   ├── AdminAuthContext.tsx  # Admin authentication
│   └── DriverAuthContext.tsx # Driver authentication
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useDriverAuth.ts # Driver authentication hook
│   └── use-mobile.tsx   # Mobile detection hook
├── lib/                 # Utility libraries
│   ├── database.ts      # Database operations
│   ├── bookingHistory.ts # Booking management
│   └── utils.ts         # General utilities
├── pages/               # Page components
│   ├── Index.tsx        # Main booking page
│   ├── LandingPage.tsx  # Landing page
│   ├── AdminPage.tsx    # Admin dashboard
│   └── DriverDashboard.tsx # Driver dashboard
├── types/               # TypeScript type definitions
│   └── database.ts      # Database types
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd heyauto-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
npm run dev
```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Quick Start Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Documentation
npm run docs:generate    # Generate documentation
npm run docs:serve       # Serve documentation
npm run docs:build       # Generate and serve docs
npm run docs:dev         # Watch mode for docs
npm run docs:clean       # Clean documentation files
```

## 📚 Documentation

### Generated Documentation
This project includes comprehensive documentation generated from JSDoc comments:

- **Component Documentation**: All React components with props, examples, and usage
- **API Reference**: Hooks, utilities, and context documentation
- **Type Definitions**: Complete TypeScript interface documentation

### Accessing Documentation

1. **Generate documentation**
   ```bash
   npm run docs:generate
   ```

2. **Serve documentation**
   ```bash
   npm run docs:serve
   ```

3. **View in browser**
   Open `http://localhost:3000` to view the documentation

### Documentation Features
- **Interactive API Explorer**: Browse all components and functions
- **Code Examples**: Real-world usage examples for each component
- **Type Information**: Complete TypeScript type definitions
- **Search Functionality**: Find components and functions quickly
- **Responsive Design**: Works on all devices

## 🔧 API Reference

### Authentication Hooks

#### `useAuth()`
Main authentication hook for user management.

```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

**Returns:**
- `user`: Current user object or null
- `isAuthenticated`: Boolean authentication state
- `login(email, password)`: Login function
- `logout()`: Logout function
- `register(name, email, phone, password)`: Registration function

#### `useDriverAuth()`
Driver-specific authentication hook.

```tsx
const { driver, loginDriver, logoutDriver } = useDriverAuth();
```

### Utility Functions

#### `cn(...inputs)`
Merge Tailwind CSS classes efficiently.

```tsx
cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
```

#### `useIsMobile()`
Detect mobile viewport.

```tsx
const isMobile = useIsMobile();
```

### Core Components

#### `BookingInterface`
Main booking component with three-step flow.

```tsx
<BookingInterface />
```

**Features:**
- Location detection
- Fare calculation
- Driver assignment
- OTP generation

#### `AuthPage`
Authentication page with multiple login methods.

```tsx
<AuthPage />
```

**Features:**
- Email/phone login
- Social authentication
- Registration
- Password recovery

## 🛠 Development

### Code Style
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (if configured)
- **TypeScript**: Strict type checking enabled

### Component Guidelines
- Use functional components with hooks
- Add JSDoc comments for all public APIs
- Follow the established file structure
- Use TypeScript interfaces for props

### Adding New Features
1. Create component in appropriate directory
2. Add JSDoc documentation
3. Export from index files if needed
4. Update type definitions
5. Add tests if applicable

### Database Operations
All database operations are handled through the `database` utility:

```tsx
import { database } from '@/lib/database';

// Get user by ID
const user = await database.getUserById('123');

// Create new user
const newUser = await database.createUser(userData);
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

#### Netlify
1. Connect repository or drag `dist` folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`

#### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions to build and deploy
3. Set source to GitHub Actions

#### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder to your hosting service
3. Configure server for SPA routing

### Environment Variables
Create `.env.local` for environment-specific configuration:

```env
VITE_API_URL=your_api_url
VITE_MAP_API_KEY=your_map_api_key
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Code Review Process
- All changes require review
- Ensure tests pass
- Update documentation
- Follow coding standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues

## 🔄 Version History

- **v1.0.0** - Initial release with core booking functionality
- **v1.1.0** - Added admin dashboard and driver management
- **v1.2.0** - Enhanced documentation and TypeScript support

---

**Built with ❤️ for Vadanappally, Kerala**
