import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation, 
  User, 
  Car, 
  Star, 
  Filter,
  Calendar,
  DollarSign,
  Route,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { bookingHistoryManager, BookingHistoryItem, BookingHistoryFilters } from '@/lib/bookingHistory';
import { useToast } from '@/hooks/use-toast';

/**
 * Props for the BookingHistory component
 * @interface BookingHistoryProps
 */
interface BookingHistoryProps {
  /** Function to go back to previous page */
  onBack: () => void;
}

/**
 * Booking history component that displays and manages user's booking history
 * 
 * @component
 * @param {BookingHistoryProps} props - Component props
 * @returns {JSX.Element} The booking history component
 * 
 * @example
 * ```tsx
 * <BookingHistory onBack={() => setCurrentPage('home')} />
 * ```
 */
const BookingHistory: React.FC<BookingHistoryProps> = ({ onBack }) => {
  /** All user bookings */
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  /** Filtered bookings based on current filters */
  const [filteredBookings, setFilteredBookings] = useState<BookingHistoryItem[]>([]);
  /** Current filter settings */
  const [filters, setFilters] = useState<BookingHistoryFilters>({ status: 'all' });
  /** Search term for filtering bookings */
  const [searchTerm, setSearchTerm] = useState('');
  /** Booking statistics */
  const [stats, setStats] = useState(bookingHistoryManager.getStats());
  /** Loading state while fetching bookings */
  const [loading, setLoading] = useState(true);
  /** Toast notification hook */
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  // Load sample data if no bookings exist
  useEffect(() => {
    const history = bookingHistoryManager.getHistory();
    if (history.length === 0) {
      bookingHistoryManager.loadSampleData();
      loadBookings();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters, searchTerm]);

  const loadBookings = () => {
    setLoading(true);
    const history = bookingHistoryManager.getHistory();
    setBookings(history);
    setStats(bookingHistoryManager.getStats());
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = bookingHistoryManager.filterBookings(filters);
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.driver.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as any }));
  };

  const handleRateBooking = (bookingId: string, rating: number) => {
    const success = bookingHistoryManager.updateBooking(bookingId, { rating });
    if (success) {
      loadBookings();
      toast({
        title: "Rating submitted! ⭐",
        description: "Thank you for your feedback"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Booking History</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                <p className="text-xs text-muted-foreground">Total Rides</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹{stats.totalSpent}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Filters</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filters.status !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'You haven\'t made any bookings yet'
              }
            </p>
            {!searchTerm && filters.status === 'all' && (
              <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
                Book Your First Ride
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(booking.status)}
                    <div>
                      <p className="font-medium text-sm">{formatDate(booking.bookingDate)}</p>
                      <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{booking.fare}</p>
                    <p className="text-xs text-muted-foreground">{booking.distance} km</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">From:</span>
                    <span className="flex-1">{booking.pickup}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">To:</span>
                    <span className="flex-1">{booking.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{booking.driver.name}</p>
                      <div className="flex items-center space-x-1">
                        <Car className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{booking.driver.vehicle_number}</span>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'completed' && (
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateBooking(booking.id, star)}
                          className="text-muted-foreground hover:text-yellow-500 transition-colors"
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              booking.rating && star <= booking.rating 
                                ? 'text-yellow-500 fill-current' 
                                : ''
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {booking.duration && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Trip Duration:</span>
                      <span className="font-medium">{booking.duration} minutes</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

