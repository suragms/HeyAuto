import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Home, Menu, User, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import autorickshawHero from '@/assets/autorickshaw-hero.png';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

/**
 * Props for the NavigationHeader component
 * @interface NavigationHeaderProps
 */
interface NavigationHeaderProps {
  /** Current active page */
  currentPage: 'home' | 'history';
  /** Function to handle page navigation */
  onNavigate: (page: 'home' | 'history') => void;
  /** Optional menu click handler */
  onMenuClick?: () => void;
  /** Optional profile click handler */
  onProfileClick?: () => void;
}

/**
 * Navigation header component with user menu and page navigation
 * Displays app logo, navigation tabs, and user profile dropdown
 * 
 * @component
 * @param {NavigationHeaderProps} props - Component props
 * @returns {JSX.Element} The navigation header component
 * 
 * @example
 * ```tsx
 * <NavigationHeader 
 *   currentPage="home"
 *   onNavigate={handleNavigate}
 *   onProfileClick={handleProfileClick}
 * />
 * ```
 */
const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  currentPage, 
  onNavigate, 
  onMenuClick,
  onProfileClick
}) => {
  /** Authentication context */
  const { user, logout } = useAuth();
  /** Toast notification hook */
  const { toast } = useToast();
  /** Navigation hook */
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className="bg-gradient-hero text-white px-4 py-6 pb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center group">
            <div className="relative">
              <img 
                src={autorickshawHero} 
                alt="AutoNow"
                className="w-14 h-14 mr-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-green rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text">
                HeyAuto
              </h1>
              <p className="text-white/90 text-sm font-medium">Quick & reliable autorickshaw rides</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 transition-all duration-200 hover:scale-105 group"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick} className="hover:bg-primary/5 transition-colors duration-200">
                    <User className="mr-3 h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-white/15 backdrop-blur-sm rounded-xl p-1.5 shadow-lg">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('home')}
            className={`flex-1 transition-all duration-300 ${
              currentPage === 'home' 
                ? 'bg-white text-primary shadow-lg scale-105' 
                : 'text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="font-semibold">Book Ride</span>
          </Button>
          
          <Button
            variant={currentPage === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('history')}
            className={`flex-1 transition-all duration-300 ${
              currentPage === 'history' 
                ? 'bg-white text-primary shadow-lg scale-105' 
                : 'text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            <span className="font-semibold">History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;

