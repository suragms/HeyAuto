# Development Guide - HeyAuto

This guide provides detailed information for developers working on the HeyAuto project.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup
```bash
# Clone repository
git clone <repository-url>
cd heyauto-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Architecture

### Component Structure
```
src/components/
├── admin/              # Admin-specific components
│   ├── AdminDashboard.tsx
│   ├── AdminLoginForm.tsx
│   └── ...
├── auth/               # Authentication components
│   ├── AuthPage.tsx
│   ├── LoginForm.tsx
│   └── ...
├── ui/                 # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── BookingInterface.tsx # Main booking component
```

### State Management
- **React Context**: Global state (auth, theme, etc.)
- **Local State**: Component-specific state with useState
- **Custom Hooks**: Reusable stateful logic
- **Local Storage**: Persistent data storage

### Data Flow
1. **User Actions** → Components
2. **Components** → Context/Hooks
3. **Context/Hooks** → Database/API
4. **Database/API** → Context/Hooks
5. **Context/Hooks** → Components
6. **Components** → UI Updates

## 🛠 Development Tools

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npx tsc --noEmit
```

### Documentation
```bash
# Generate documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve

# Watch mode for documentation
npm run docs:dev
```

### Testing
```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type assertions sparingly
- Prefer `interface` over `type` for object shapes

### React Components
- Use functional components with hooks
- Add JSDoc comments for all public APIs
- Use proper prop types and interfaces
- Follow the single responsibility principle

### File Naming
- Components: PascalCase (e.g., `BookingInterface.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utilities: camelCase (e.g., `bookingHistory.ts`)
- Types: PascalCase (e.g., `database.ts`)

### Code Organization
- Group related functionality together
- Use barrel exports for clean imports
- Keep components small and focused
- Extract reusable logic into custom hooks

## 🔧 Component Development

### Creating New Components
1. Create component file in appropriate directory
2. Add JSDoc documentation
3. Define TypeScript interfaces for props
4. Export component
5. Add to index file if needed

### Example Component Structure
```tsx
import React from 'react';

/**
 * Component description
 * @interface ComponentProps
 */
interface ComponentProps {
  /** Prop description */
  prop1: string;
  /** Optional prop description */
  prop2?: number;
}

/**
 * Component JSDoc description
 * @param {ComponentProps} props - Component props
 * @returns {JSX.Element} Rendered component
 * 
 * @example
 * ```tsx
 * <Component prop1="value" prop2={123} />
 * ```
 */
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Custom Hooks
```tsx
import { useState, useEffect } from 'react';

/**
 * Custom hook description
 * @param {string} param - Parameter description
 * @returns {Object} Hook return value
 * @returns {string} returns.value - Return value description
 */
export const useCustomHook = (param: string) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // Hook logic
  }, [param]);

  return { value };
};
```

## 🗄 Database Operations

### Database Structure
The application uses localStorage for data persistence with the following structure:

```typescript
interface Database {
  users: User[];
  drivers: Driver[];
  bookings: Booking[];
  // ... other collections
}
```

### Database Operations
```tsx
import { database } from '@/lib/database';

// Get data
const users = await database.getAllUsers();
const user = await database.getUserById('123');

// Create data
const newUser = await database.createUser(userData);

// Update data
const updatedUser = await database.updateUser('123', updates);

// Delete data
await database.deleteUser('123');
```

## 🎨 Styling Guidelines

### Tailwind CSS
- Use utility classes for styling
- Follow mobile-first approach
- Use design system colors and spacing
- Avoid custom CSS when possible

### Component Styling
```tsx
// Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Avoid
<div style={{ display: 'flex', padding: '16px' }}>
```

### Responsive Design
```tsx
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

## 🔐 Authentication

### User Authentication
- Email/password login
- Phone number login
- Social authentication (Google, GitHub)
- OTP verification

### Admin Authentication
- Separate admin context
- Protected admin routes
- Admin-specific permissions

### Driver Authentication
- Driver-specific login
- Driver profile management
- Driver status tracking

## 📱 Mobile Development

### Responsive Design
- Use `useIsMobile()` hook for mobile detection
- Implement mobile-specific layouts
- Test on various screen sizes

### Mobile Features
- Touch-friendly interactions
- Swipe gestures
- Mobile-optimized forms
- GPS location services

## 🚀 Performance Optimization

### React Performance
- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` where needed
- Avoid unnecessary re-renders
- Use proper dependency arrays

### Bundle Optimization
- Code splitting with React.lazy()
- Tree shaking for unused code
- Optimize imports
- Use dynamic imports for large libraries

### Image Optimization
- Use appropriate image formats
- Implement lazy loading
- Optimize image sizes
- Use WebP when possible

## 🐛 Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Browser DevTools
- Console logging

### Common Issues
1. **State not updating**: Check dependency arrays
2. **Infinite re-renders**: Check useEffect dependencies
3. **Type errors**: Verify interface definitions
4. **Styling issues**: Check Tailwind classes

### Debugging Tips
```tsx
// Add debug logging
console.log('Component rendered with props:', props);

// Use React DevTools Profiler
// Check component re-renders

// Use browser DevTools
// Monitor network requests
// Check localStorage
```

## 📦 Build Process

### Development Build
```bash
npm run dev
# Uses Vite dev server with HMR
```

### Production Build
```bash
npm run build
# Creates optimized build in dist/
```

### Build Optimization
- Minification
- Tree shaking
- Code splitting
- Asset optimization

## 🧪 Testing Strategy

### Unit Tests
- Test individual components
- Test custom hooks
- Test utility functions
- Mock external dependencies

### Integration Tests
- Test component interactions
- Test user flows
- Test API integrations

### E2E Tests
- Test complete user journeys
- Test cross-browser compatibility
- Test mobile responsiveness

## 📚 Documentation

### JSDoc Standards
- Document all public APIs
- Include examples
- Use proper tags
- Keep documentation up to date

### README Updates
- Update when adding features
- Include setup instructions
- Document configuration options
- Add troubleshooting section

## 🔄 Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `hotfix/*`: Hotfix branches

### Commit Messages
```
feat: add new booking feature
fix: resolve location detection issue
docs: update API documentation
style: format code with prettier
refactor: extract booking logic to hook
test: add unit tests for auth
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Add tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge to develop
8. Deploy to staging
9. Merge to main
10. Deploy to production

## 🚀 Deployment

### Environment Setup
- Development: Local development
- Staging: Pre-production testing
- Production: Live application

### Deployment Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Performance tested
- [ ] Security reviewed

## 🆘 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm install @types/react @types/react-dom
```

#### Styling Issues
```bash
# Check Tailwind configuration
npx tailwindcss --init

# Verify PostCSS setup
npm run build
```

### Getting Help
- Check existing issues
- Review documentation
- Ask in team chat
- Create new issue with details

## 📈 Performance Monitoring

### Metrics to Track
- Page load times
- Component render times
- Bundle size
- Memory usage
- User interactions

### Tools
- React DevTools Profiler
- Chrome DevTools
- Lighthouse
- Web Vitals

## 🔒 Security Considerations

### Data Protection
- Sanitize user inputs
- Validate all data
- Use HTTPS in production
- Secure API endpoints

### Authentication
- Implement proper session management
- Use secure password hashing
- Implement rate limiting
- Validate JWT tokens

### Best Practices
- Keep dependencies updated
- Regular security audits
- Follow OWASP guidelines
- Implement proper CORS

---

**Happy Coding! 🚀**
