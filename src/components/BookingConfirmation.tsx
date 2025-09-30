import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Clock, IndianRupee } from 'lucide-react';

/**
 * Booking details interface
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
}

/**
 * Props for the BookingConfirmation component
 * @interface BookingConfirmationProps
 */
interface BookingConfirmationProps {
  /** Booking details to display */
  bookingDetails: BookingDetails;
  /** Function to confirm the booking */
  onConfirm: () => void;
  /** Function to cancel the booking */
  onCancel: () => void;
}

/**
 * Booking confirmation component that displays booking details before confirmation
 * 
 * @component
 * @param {BookingConfirmationProps} props - Component props
 * @returns {JSX.Element} The booking confirmation component
 * 
 * @example
 * ```tsx
 * <BookingConfirmation 
 *   bookingDetails={bookingDetails}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 */
const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingDetails,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-6">
        <h1 className="text-xl font-semibold text-center">Confirm Your Ride</h1>
      </div>

      <div className="px-4 py-6">
        <Card className="bg-card shadow-card border-0 mb-6">
          <div className="p-6">
            {/* Route */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-foreground">Route</h3>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-kerala-green rounded-full"></div>
                  <div className="w-0.5 h-6 bg-border my-1"></div>
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{bookingDetails.pickup}</p>
                  <div className="py-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{bookingDetails.destination}</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
              <div className="text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-semibold">{bookingDetails.distance} km</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="text-sm font-semibold">{bookingDetails.eta} mins</p>
              </div>
              <div className="text-center">
                <IndianRupee className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Fare</p>
                <p className="text-sm font-semibold">₹{bookingDetails.fare}</p>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="mt-4 p-4 bg-gradient-card rounded-lg border">
              <h4 className="font-medium mb-2 text-foreground">Fare Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base fare</span>
                  <span>₹25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance ({bookingDetails.distance} km @ ₹12/km)</span>
                  <span>₹{Math.round(bookingDetails.distance * 12)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{bookingDetails.fare}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onConfirm}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-button"
          >
            Confirm & Book Now
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;