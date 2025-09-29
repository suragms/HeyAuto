import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DriverAuthProvider, useDriverAuth } from "@/contexts/DriverAuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./components/auth/AuthPage";
import UserProfile from "./components/auth/UserProfile";
import DatabaseManager from "./components/admin/DatabaseManager";
import ProtectedRoute from "./components/ProtectedRoute";
import DriverProtectedRoute from "./components/DriverProtectedRoute";
import DriverAuthPage from "./components/auth/DriverAuthPage";
import DriverDashboard from "./pages/DriverDashboard";
import DriverProfile from "./components/auth/DriverProfile";
import DriverRouteMap from "./pages/DriverRouteMap";
import AutoDetails from "./pages/AutoDetails";
import TestDriver from "./pages/TestDriver";
import DebugDriver from "./components/DebugDriver";
import LocalStorageTest from "./components/LocalStorageTest";
import ProfileDiagnostic from "./components/ProfileDiagnostic";
import DriverProfileTest from "./components/DriverProfileTest";
import SimpleDriverProfile from "./components/SimpleDriverProfile";
import NavigationTest from "./components/NavigationTest";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import "./lib/migrateData"; // Migrate existing data
import "./lib/sampleData"; // Initialize sample data
import "./lib/driverSampleData"; // Initialize driver sample data

const queryClient = new QueryClient();

// Component to handle driver routes
const DriverRoutes = () => {
  const { isAuthenticated: isDriverAuthenticated, isLoading: isDriverLoading } = useDriverAuth();

  console.log('DriverRoutes: Rendering with isDriverAuthenticated:', isDriverAuthenticated, 'isDriverLoading:', isDriverLoading);

  if (isDriverLoading) {
    console.log('DriverRoutes: Showing loading state');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={<DriverAuthPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <DriverProtectedRoute>
            <DriverDashboard />
          </DriverProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <DriverProtectedRoute>
            <DriverProfile />
          </DriverProtectedRoute>
        } 
      />
      <Route 
        path="/route-map" 
        element={
          <DriverProtectedRoute>
            <DriverRouteMap />
          </DriverProtectedRoute>
        } 
      />
      <Route 
        path="/auto-details" 
        element={
          <DriverProtectedRoute>
            <AutoDetails />
          </DriverProtectedRoute>
        } 
      />
      {/* Redirect authenticated drivers to dashboard */}
      {isDriverAuthenticated && (
        <Route path="/" element={<DriverDashboard />} />
      )}
      {/* Redirect unauthenticated drivers to auth */}
      {!isDriverAuthenticated && (
        <Route path="/" element={<DriverAuthPage />} />
      )}
    </Routes>
  );
};

// Component to handle route logic based on auth state
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('AppRoutes: Rendering with isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('AppRoutes: Showing loading state');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Index /> : <LandingPage />} 
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/database" 
        element={
          <ProtectedRoute>
            <DatabaseManager />
          </ProtectedRoute>
        } 
      />
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <AdminAuthProvider>
          <AdminPage />
        </AdminAuthProvider>
      } />
      <Route path="/test-driver" element={<TestDriver />} />
      <Route path="/debug-driver" element={
        <DriverAuthProvider>
          <DebugDriver />
        </DriverAuthProvider>
      } />
      <Route path="/localstorage-test" element={<LocalStorageTest />} />
        <Route path="/profile-diagnostic" element={
          <DriverAuthProvider>
            <ProfileDiagnostic />
          </DriverAuthProvider>
        } />
        <Route path="/driver-profile-test" element={
          <DriverAuthProvider>
            <DriverProfileTest />
          </DriverAuthProvider>
        } />
        <Route path="/simple-driver-profile" element={
          <DriverAuthProvider>
            <SimpleDriverProfile />
          </DriverAuthProvider>
        } />
        <Route path="/navigation-test" element={
          <DriverAuthProvider>
            <NavigationTest />
          </DriverAuthProvider>
        } />
      {/* Driver Routes */}
      <Route path="/driver/*" element={
        <DriverAuthProvider>
          <DriverRoutes />
        </DriverAuthProvider>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
