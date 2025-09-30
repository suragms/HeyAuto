import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BookingMap from './BookingMap';
import BookingConfirmation from './BookingConfirmation';
import TripDetails from './TripDetails';
import { MapPin, RefreshCw, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { bookingHistoryManager } from '@/lib/bookingHistory';
import autorickshawHero from '@/assets/autorickshaw-hero.png';

/**
 * Represents a driver in the system
 * @interface Driver
 */
interface Driver {
  /** Unique identifier for the driver */
  id: number;
  /** Driver's full name */
  name: string;
  /** Vehicle registration number */
  vehicle_number: string;
  /** Current status of the driver (available, busy, offline) */
  status: string;
}

/**
 * Represents the different steps in the booking process
 * @type BookingStep
 */
type BookingStep = 'input' | 'confirmation' | 'trip';

/**
 * Contains all details for a booking
 * @interface BookingDetails
 */
interface BookingDetails {
  /** Pickup location text */
  pickup: string;
  /** Destination location text */
  destination: string;
  /** Distance in kilometers */
  distance: number;
  /** Calculated fare in rupees */
  fare: number;
  /** Estimated time of arrival in minutes */
  eta: number;
  /** Assigned driver information */
  driver: Driver | null;
  /** OTP for verification */
  otp: string | null;
}

/**
 * Main booking interface component that handles the complete booking flow
 * 
 * This component manages the three-step booking process:
 * 1. Input: User enters pickup and destination
 * 2. Confirmation: Shows fare and ETA before confirming
 * 3. Trip: Shows driver details and OTP for verification
 * 
 * @component
 * @returns {JSX.Element} The booking interface component
 * 
 * @example
 * ```tsx
 * <BookingInterface />
 * ```
 */
const BookingInterface: React.FC = () => {
  /** Current step in the booking process */
  const [step, setStep] = useState<BookingStep>('input');
  /** User's current GPS coordinates [latitude, longitude] */
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  /** Human-readable location text */
  const [locationText, setLocationText] = useState('Getting your location...');
  /** Destination entered by user */
  const [destination, setDestination] = useState('');
  /** Complete booking details including driver and OTP */
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  /** Loading state for location detection */
  const [isLocating, setIsLocating] = useState(false);
  /** Toast notification hook */
  const { toast } = useToast();
  /** Authentication context */
  const { user } = useAuth();

  // Set current user for booking history
  useEffect(() => {
    if (user) {
      bookingHistoryManager.setCurrentUser(user.id);
    }
  }, [user]);

  /**
   * Calculates the fare based on distance
   * @param {number} distance - Distance in kilometers
   * @returns {number} Calculated fare in rupees
   * 
   * @example
   * ```tsx
   * const fare = calculateFare(5.2); // Returns 87
   * ```
   */
  const calculateFare = (distance: number): number => {
    const baseFare = 25;
    const costPerKm = 12;
    return Math.round(baseFare + (costPerKm * distance));
  };

  /**
   * Assigns a random available driver and generates OTP
   * @returns {Object} Object containing driver and OTP
   * @returns {Driver} returns.driver - Assigned driver information
   * @returns {string} returns.otp - 4-digit OTP for verification
   * 
   * @example
   * ```tsx
   * const { driver, otp } = assignDriver();
   * console.log(driver.name); // "Sunil P."
   * console.log(otp); // "1234"
   * ```
   */
  const assignDriver = (): { driver: Driver; otp: string } => {
    const availableDrivers: Driver[] = [
      { id: 1, name: "Sunil P.", vehicle_number: "KL 47 B 5501", status: "available" },
      { id: 2, name: "Ravi K.", vehicle_number: "KL 47 C 1299", status: "available" },
      { id: 4, name: "Mahesh T.", vehicle_number: "KL 47 D 2134", status: "available" },
      { id: 5, name: "Krishnan M.", vehicle_number: "KL 47 E 9876", status: "available" }
    ];
    
    const randomDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    return { driver: randomDriver, otp };
  };

  /**
   * Gets the user's current location using the Geolocation API
   * Updates the locationText state with a human-readable address
   * 
   * @async
   * @function getUserLocation
   * @returns {Promise<void>}
   * 
   * @example
   * ```tsx
   * await getUserLocation();
   * // locationText will be updated with current address
   * ```
   */
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationText('Getting your location...');

    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      // Fallback to Vadanappally coordinates
      setUserLocation([10.5518, 76.2072]);
      setLocationText('Vadanappally, Kerala');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocationText('Current Location, Vadanappally');
        setIsLocating(false);
        toast({
          title: "Location found!",
          description: "We've located your pickup point"
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Vadanappally coordinates
        setUserLocation([10.5518, 76.2072]);
        setLocationText('Vadanappally, Kerala');
        setIsLocating(false);
        toast({
          title: "Using default location",
          description: "Couldn't get precise location, using Vadanappally center"
        });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 300000 
      }
    );
  };

  /**
   * Handles the "Find Auto" button click
   * Validates destination input and calculates fare/ETA
   * Moves to confirmation step
   * 
   * @function handleFindAuto
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // User enters destination and clicks "Find Auto"
   * handleFindAuto();
   * // Moves to confirmation step with calculated fare
   * ```
   */
  const handleFindAuto = () => {
    if (!destination.trim()) {
      toast({
        title: "Enter destination",
        description: "Please enter where you want to go",
        variant: "destructive"
      });
      return;
    }

    const distance = Math.random() * 8 + 2; // Random distance between 2-10 km
    const fare = calculateFare(distance);
    const eta = Math.floor(Math.random() * 8 + 2); // Random ETA between 2-10 mins

    setBookingDetails({
      pickup: locationText,
      destination: destination.trim(),
      distance: Math.round(distance * 10) / 10,
      fare,
      eta,
      driver: null,
      otp: null
    });

    setStep('confirmation');
  };

  /**
   * Confirms the booking and assigns a driver
   * Generates OTP and saves booking to history
   * Moves to trip step
   * 
   * @function handleConfirmBooking
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // User confirms booking from confirmation screen
   * handleConfirmBooking();
   * // Driver assigned, OTP generated, moves to trip step
   * ```
   */
  const handleConfirmBooking = () => {
    if (!bookingDetails) return;

    const { driver, otp } = assignDriver();
    
    const confirmedBooking = {
      ...bookingDetails,
      driver,
      otp
    };
    
    setBookingDetails(confirmedBooking);

    // Save booking as in_progress to history
    bookingHistoryManager.addBooking({
      pickup: confirmedBooking.pickup,
      destination: confirmedBooking.destination,
      distance: confirmedBooking.distance,
      fare: confirmedBooking.fare,
      driver: confirmedBooking.driver,
      status: 'in_progress'
    });

    setStep('trip');
    
    toast({
      title: "Booking confirmed! 🎉",
      description: `${driver.name} is coming to pick you up`
    });
  };

  /**
   * Resets the booking interface to initial state
   * Clears destination and booking details
   * Returns to input step
   * 
   * @function handleNewBooking
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // User wants to make a new booking
   * handleNewBooking();
   * // Interface resets to input step
   * ```
   */
  const handleNewBooking = () => {
    setStep('input');
    setDestination('');
    setBookingDetails(null);
  };

  // Initialize location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  if (step === 'confirmation' && bookingDetails) {
    return (
      <BookingConfirmation
        bookingDetails={bookingDetails}
        onConfirm={handleConfirmBooking}
        onCancel={() => setStep('input')}
      />
    );
  }

  if (step === 'trip' && bookingDetails?.driver && bookingDetails?.otp) {
    return (
      <TripDetails
        bookingDetails={bookingDetails}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="px-4 pb-6 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-card shadow-card border-0 overflow-hidden relative">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Book Your Ride</h2>
              <p className="text-sm text-muted-foreground">Quick and reliable autorickshaw service</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Map */}
          <div className="relative mb-6 group">
            <BookingMap 
              userLocation={userLocation} 
              className="w-full h-52 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-foreground">Live Tracking</span>
              </div>
            </div>
          </div>

          {/* Location Inputs */}
          <div className="space-y-5">
            {/* Pickup Location */}
            <div className="relative group">
              <label className="block text-sm font-medium text-foreground mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-3 h-3 bg-kerala-green rounded-full shadow-sm"></div>
                </div>
                <Input
                  value={locationText}
                  readOnly
                  className="pl-12 pr-14 h-12 bg-muted/50 text-muted-foreground border-2 border-transparent focus:border-primary/20 transition-all duration-200"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={isLocating}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-200"
                >
                  <RefreshCw className={`h-4 w-4 text-primary ${isLocating ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              {isLocating && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center" role="status" aria-live="polite">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" aria-hidden="true"></div>
                  Getting your location...
                </p>
              )}
            </div>

            {/* Destination */}
            <div className="relative group">
              <label className="block text-sm font-medium text-foreground mb-2">
                Where to?
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <Input
                  placeholder="Enter your destination..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 h-12 border-2 border-transparent focus:border-primary/20 transition-all duration-200"
                  autoFocus
                  aria-label="Enter your destination"
                  aria-describedby="destination-help"
                />
              </div>
            </div>
          </div>

          {/* Find Auto Button */}
          <Button 
            onClick={handleFindAuto}
            className="w-full mt-8 h-14 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-button transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!userLocation || !destination.trim()}
            aria-label="Find autorickshaw for your destination"
            role="button"
          >
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5" aria-hidden="true" />
              <span>Find Auto</span>
            </div>
          </Button>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">2-5 min</div>
              <div className="text-xs text-muted-foreground">ETA</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-kerala-green">₹25</div>
              <div className="text-xs text-muted-foreground">Base Fare</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingInterface;