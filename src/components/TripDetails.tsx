import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, X, CheckCircle2, User, Car, Hash, CreditCard, Smartphone, Banknote, MapPin, Navigation, Clock } from 'lucide-react';
import autorickshawHero from '@/assets/autorickshaw-hero.png';
import { bookingHistoryManager } from '@/lib/bookingHistory';
import { useToast } from '@/hooks/use-toast';

/**
 * Driver interface for trip details
 * @interface Driver
 */
interface Driver {
  /** Driver ID */
  id: number;
  /** Driver name */
  name: string;
  /** Vehicle number */
  vehicle_number: string;
  /** Driver status */
  status: string;
}

/**
 * Booking details interface for trip
 * @interface BookingDetails
 */
interface BookingDetails {
  /** Pickup location */
  pickup: string;
  /** Destination location */
  destination: string;
  /** Distance in kilometers */
  distance: number;
  /** Fare in rupees */
  fare: number;
  /** Estimated time of arrival in minutes */
  eta: number;
  /** Driver information */
  driver: Driver;
  /** OTP for verification */
  otp: string;
}

/**
 * Props for the TripDetails component
 * @interface TripDetailsProps
 */
interface TripDetailsProps {
  /** Booking details for the trip */
  bookingDetails: BookingDetails;
  /** Function to start a new booking */
  onNewBooking: () => void;
}

/**
 * Trip details component that displays active trip information and progress
 * Shows driver details, OTP, trip progress, and payment options
 * 
 * @component
 * @param {TripDetailsProps} props - Component props
 * @returns {JSX.Element} The trip details component
 * 
 * @example
 * ```tsx
 * <TripDetails 
 *   bookingDetails={bookingDetails}
 *   onNewBooking={handleNewBooking}
 * />
 * ```
 */
const TripDetails: React.FC<TripDetailsProps> = ({ bookingDetails, onNewBooking }) => {
  /** Whether trip has been completed */
  const [tripCompleted, setTripCompleted] = useState(false);
  /** Current booking ID */
  const [bookingId, setBookingId] = useState<string | null>(null);
  /** Trip progress percentage (0-100) */
  const [tripProgress, setTripProgress] = useState(0);
  /** Whether payment section is visible */
  const [showPayment, setShowPayment] = useState(false);
  /** Selected payment method */
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | null>(null);
  /** Remaining time in seconds */
  const [remainingTime, setRemainingTime] = useState(0);
  /** Total trip time in seconds */
  const [totalTripTime, setTotalTripTime] = useState(0);
  /** Toast notification hook */
  const { toast } = useToast();

  // Format remaining time
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Find the in_progress booking for this trip
  useEffect(() => {
    const history = bookingHistoryManager.getHistory();
    const inProgressBooking = history.find(booking => 
      booking.status === 'in_progress' &&
      booking.pickup === bookingDetails.pickup &&
      booking.destination === bookingDetails.destination &&
      booking.driver.id === bookingDetails.driver.id
    );
    
    if (inProgressBooking) {
      setBookingId(inProgressBooking.id);
    }
  }, [bookingDetails]);

  // Simulate trip progress
  useEffect(() => {
    if (tripCompleted || showPayment) return;

    // Initialize total trip time (random between 3-10 minutes)
    const initialTime = Math.floor(Math.random() * 420) + 180; // 3-10 minutes in seconds
    setTotalTripTime(initialTime);
    setRemainingTime(initialTime);

    const progressInterval = setInterval(() => {
      setTripProgress(prev => {
        if (prev >= 100) {
          // Trip reached destination - automatically complete trip
          setShowPayment(true);
          setRemainingTime(0);
          clearInterval(progressInterval);
          
          // Show payment options after reaching destination
          setTimeout(() => {
            setShowPayment(true);
            setTripCompleted(false);
            
            toast({
              title: "You've reached your destination! 🎉",
              description: "Please complete your payment"
            });
          }, 3000); // Show payment after 3 seconds
          
          return 100;
        }
        return prev + Math.random() * 15; // Random progress increment
      });
    }, 2000); // Update every 2 seconds

    // Countdown timer
    const timeInterval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(timeInterval);
          return 0;
        }
        return prev - 2; // Decrease by 2 seconds every 2 seconds
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [tripCompleted, showPayment]);

  const handleCallDriver = () => {
    // In a real app, this would initiate a phone call
    alert('Calling driver...');
  };

  const handleCancelRide = () => {
    if (confirm('Are you sure you want to cancel this ride?')) {
      if (bookingId) {
        // Update existing booking to cancelled
        bookingHistoryManager.cancelBooking(bookingId);
      } else {
        // Fallback: create new cancelled booking
        bookingHistoryManager.addBooking({
          pickup: bookingDetails.pickup,
          destination: bookingDetails.destination,
          distance: bookingDetails.distance,
          fare: bookingDetails.fare,
          driver: bookingDetails.driver,
          status: 'cancelled'
        });
      }
      
      toast({
        title: "Ride cancelled",
        description: "Your booking has been cancelled"
      });
      
      onNewBooking();
    }
  };

  const handleCompleteRide = () => {
    if (confirm('Mark this ride as completed?')) {
      // Simulate trip duration (random between 30-90 minutes)
      const duration = Math.floor(Math.random() * 60) + 30;
      
      if (bookingId) {
        // Update existing booking to completed
        bookingHistoryManager.completeBooking(bookingId, duration);
      } else {
        // Fallback: create new completed booking
        bookingHistoryManager.addBooking({
          pickup: bookingDetails.pickup,
          destination: bookingDetails.destination,
          distance: bookingDetails.distance,
          fare: bookingDetails.fare,
          driver: bookingDetails.driver,
          status: 'completed',
          duration
        });
      }
      
      setTripCompleted(true);
      
      toast({
        title: "Ride completed! 🎉",
        description: "Thank you for choosing AutoNow"
      });
    }
  };

  const handlePayment = (method: 'cash' | 'card' | 'upi') => {
    setPaymentMethod(method);
    
    // Simulate payment processing
    setTimeout(() => {
      const duration = Math.floor(Math.random() * 60) + 30;
      
      if (bookingId) {
        bookingHistoryManager.completeBooking(bookingId, duration);
      }
      
      setTripCompleted(true);
      setShowPayment(false);
      
      toast({
        title: "Payment successful! 💳",
        description: `Payment of ₹${bookingDetails.fare} completed via ${method.toUpperCase()}`
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-6">
        <div className="text-center">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
          <h1 className="text-xl font-semibold">
            {showPayment ? "Trip Completed!" : "Your auto is on its way!"}
          </h1>
          {!tripCompleted && !showPayment && remainingTime > 0 ? (
            <p className="text-white/90 text-sm mt-1">
              Arriving in {formatTime(remainingTime)} (Total: {formatTime(totalTripTime)})
            </p>
          ) : showPayment ? (
            <p className="text-white/90 text-sm mt-1">Please complete your payment</p>
          ) : (
            <p className="text-white/90 text-sm mt-1">Arriving in {bookingDetails.eta} minutes</p>
          )}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Driver Details Card */}
        <Card className="bg-card shadow-card border-0 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{bookingDetails.driver.name}</h3>
                <p className="text-muted-foreground">Your AutoNow driver</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Car className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="font-medium text-sm">{bookingDetails.driver.vehicle_number}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                <Hash className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">OTP</p>
                  <p className="font-bold text-lg text-primary">{bookingDetails.otp}</p>
                </div>
              </div>
            </div>

            {/* Auto illustration */}
            <div className="flex justify-center my-6">
              <img 
                src={autorickshawHero} 
                alt="AutoRickshaw"
                className="w-24 h-24 opacity-80"
              />
            </div>
          </div>
        </Card>

        {/* Trip Progress */}
        {!tripCompleted && !showPayment && (
          <Card className="bg-card shadow-card border-0 mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Trip Progress</h4>
                <span className="text-sm text-muted-foreground">{Math.round(tripProgress)}%</span>
              </div>
              
              {/* Time Display */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Time</div>
                  <div className="font-semibold text-sm">{formatTime(totalTripTime)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Elapsed</div>
                  <div className="font-semibold text-sm text-green-600">
                    {formatTime(totalTripTime - remainingTime)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Remaining</div>
                  <div className={`font-semibold text-sm ${
                    remainingTime <= 60 ? 'text-red-500' : 
                    remainingTime <= 180 ? 'text-yellow-600' : 'text-primary'
                  }`}>
                    {formatTime(remainingTime)}
                  </div>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    remainingTime <= 60 ? 'bg-red-500' : 
                    remainingTime <= 180 ? 'bg-yellow-500' : 'bg-primary'
                  }`}
                  style={{ width: `${tripProgress}%` }}
                ></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">From: {bookingDetails.pickup}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">To: {bookingDetails.destination}</span>
                  </div>
                </div>
                
                {/* Status message based on remaining time */}
                <div className="text-center">
                  {remainingTime <= 60 && remainingTime > 0 && (
                    <p className="text-sm text-red-500 font-medium">
                      🚨 Almost there! Less than 1 minute remaining
                    </p>
                  )}
                  {remainingTime <= 180 && remainingTime > 60 && (
                    <p className="text-sm text-yellow-600 font-medium">
                      ⏰ Approaching destination - {Math.ceil(remainingTime / 60)} minutes left
                    </p>
                  )}
                  {remainingTime > 180 && (
                    <p className="text-sm text-muted-foreground">
                      🚗 On the way to your destination
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Payment Options After Trip Completion */}
        {showPayment && !tripCompleted && (
          <Card className="bg-card shadow-card border-0 mb-6">
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Trip Completed!</h3>
                <p className="text-muted-foreground mb-4">Please complete your payment</p>
                
                {/* Trip Summary */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-muted-foreground">Trip Time</div>
                      <div className="font-semibold">{formatTime(totalTripTime)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Total Fare</div>
                      <div className="font-semibold text-primary">₹{bookingDetails.fare}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => handlePayment('cash')}
                  className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg"
                  disabled={paymentMethod !== null}
                >
                  <Banknote className="w-6 h-6 mr-3" />
                  💰 Pay Now with Cash - ₹{bookingDetails.fare}
                </Button>

                <Button
                  onClick={() => handlePayment('card')}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                  disabled={paymentMethod !== null}
                >
                  <CreditCard className="w-6 h-6 mr-3" />
                  💳 Pay Now with Card - ₹{bookingDetails.fare}
                </Button>

                <Button
                  onClick={() => handlePayment('upi')}
                  className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg"
                  disabled={paymentMethod !== null}
                >
                  <Smartphone className="w-6 h-6 mr-3" />
                  📱 Pay Now with UPI - ₹{bookingDetails.fare}
                </Button>
              </div>

              {paymentMethod && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-primary">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing {paymentMethod.toUpperCase()} payment...</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Trip Summary */}
        <Card className="bg-card shadow-card border-0 mb-6">
          <div className="p-4">
            <h4 className="font-medium mb-3">Trip Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span className="text-right flex-1 ml-2">{bookingDetails.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span className="text-right flex-1 ml-2">{bookingDetails.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span>{bookingDetails.distance} km</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total Fare:</span>
                <span className="text-primary">₹{bookingDetails.fare}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!tripCompleted && !showPayment && (
            <>
              <Button 
                onClick={handleCallDriver}
                className="w-full h-12 bg-kerala-green hover:bg-kerala-green/90 text-white font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Driver
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCancelRide}
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Ride
              </Button>
            </>
          )}

          {tripCompleted && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">Your trip has been completed and payment processed</p>
              <Button 
                onClick={onNewBooking}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Book Another Ride
              </Button>
            </div>
          )}

          {!tripCompleted && !showPayment && (
            <Button 
              variant="ghost" 
              onClick={onNewBooking}
              className="w-full text-muted-foreground"
            >
              Book Another Ride
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;