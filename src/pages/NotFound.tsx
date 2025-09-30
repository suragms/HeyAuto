import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

/**
 * 404 Not Found page component
 * Displays when user navigates to a non-existent route
 * 
 * @component
 * @returns {JSX.Element} The not found page component
 * 
 * @example
 * ```tsx
 * <NotFound />
 * ```
 */
const NotFound = () => {
  /** Current location object from router */
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Route Not Found</h2>
          <p className="text-muted-foreground">
            Looks like you took a wrong turn! This route doesn't exist in Vadanappally.
          </p>
        </div>
        
        <Button 
          asChild 
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-button"
        >
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;