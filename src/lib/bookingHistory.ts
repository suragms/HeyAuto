export interface BookingHistoryItem {
  id: string;
  pickup: string;
  destination: string;
  distance: number;
  fare: number;
  driver: {
    id: number;
    name: string;
    vehicle_number: string;
  };
  status: 'completed' | 'cancelled' | 'in_progress';
  bookingDate: string;
  completedDate?: string;
  duration?: number; // in minutes
  rating?: number;
  feedback?: string;
}

export interface BookingHistoryFilters {
  status?: 'all' | 'completed' | 'cancelled' | 'in_progress';
  dateRange?: {
    start: string;
    end: string;
  };
  driver?: string;
}

class BookingHistoryManager {
  private readonly STORAGE_KEY = 'autonow_booking_history';
  private currentUserId: string | null = null;

  // Set current user ID
  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  // Get user-specific storage key
  private getUserStorageKey(): string {
    return this.currentUserId ? `${this.STORAGE_KEY}_${this.currentUserId}` : this.STORAGE_KEY;
  }

  // Get all booking history
  getHistory(): BookingHistoryItem[] {
    try {
      const stored = localStorage.getItem(this.getUserStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading booking history:', error);
      return [];
    }
  }

  // Add a new booking to history
  addBooking(booking: Omit<BookingHistoryItem, 'id' | 'bookingDate'>): BookingHistoryItem {
    const newBooking: BookingHistoryItem = {
      ...booking,
      id: this.generateId(),
      bookingDate: new Date().toISOString(),
    };

    const history = this.getHistory();
    history.unshift(newBooking); // Add to beginning of array
    this.saveHistory(history);
    return newBooking;
  }

  // Update an existing booking
  updateBooking(id: string, updates: Partial<BookingHistoryItem>): boolean {
    const history = this.getHistory();
    const index = history.findIndex(booking => booking.id === id);
    
    if (index === -1) return false;
    
    history[index] = { ...history[index], ...updates };
    this.saveHistory(history);
    return true;
  }

  // Mark booking as completed
  completeBooking(id: string, duration?: number, rating?: number, feedback?: string): boolean {
    return this.updateBooking(id, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      duration,
      rating,
      feedback,
    });
  }

  // Cancel a booking
  cancelBooking(id: string): boolean {
    return this.updateBooking(id, {
      status: 'cancelled',
      completedDate: new Date().toISOString(),
    });
  }

  // Filter bookings
  filterBookings(filters: BookingHistoryFilters): BookingHistoryItem[] {
    let bookings = this.getHistory();

    if (filters.status && filters.status !== 'all') {
      bookings = bookings.filter(booking => booking.status === filters.status);
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      bookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    if (filters.driver) {
      bookings = bookings.filter(booking => 
        booking.driver.name.toLowerCase().includes(filters.driver!.toLowerCase()) ||
        booking.driver.vehicle_number.toLowerCase().includes(filters.driver!.toLowerCase())
      );
    }

    return bookings;
  }

  // Get booking statistics
  getStats() {
    const history = this.getHistory();
    const completed = history.filter(b => b.status === 'completed');
    const cancelled = history.filter(b => b.status === 'cancelled');
    
    const totalSpent = completed.reduce((sum, booking) => sum + booking.fare, 0);
    const totalDistance = completed.reduce((sum, booking) => sum + booking.distance, 0);
    const averageRating = completed.length > 0 
      ? completed.reduce((sum, booking) => sum + (booking.rating || 0), 0) / completed.length 
      : 0;

    return {
      totalBookings: history.length,
      completedBookings: completed.length,
      cancelledBookings: cancelled.length,
      totalSpent,
      totalDistance: Math.round(totalDistance * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  // Load sample data
  loadSampleData(): void {
    const sampleData: BookingHistoryItem[] = [
      {
        id: "sample_1",
        pickup: "Vadanappally Bus Stand",
        destination: "Kochi Airport",
        distance: 45.2,
        fare: 567,
        driver: {
          id: 1,
          name: "Sunil P.",
          vehicle_number: "KL 47 B 5501"
        },
        status: "completed",
        bookingDate: "2024-01-15T10:30:00.000Z",
        completedDate: "2024-01-15T11:45:00.000Z",
        duration: 75,
        rating: 5,
        feedback: "Excellent service, very punctual!"
      },
      {
        id: "sample_2",
        pickup: "Vadanappally Market",
        destination: "Thrissur Railway Station",
        distance: 28.5,
        fare: 367,
        driver: {
          id: 2,
          name: "Ravi K.",
          vehicle_number: "KL 47 C 1299"
        },
        status: "completed",
        bookingDate: "2024-01-14T14:20:00.000Z",
        completedDate: "2024-01-14T15:30:00.000Z",
        duration: 70,
        rating: 4,
        feedback: "Good driver, safe ride"
      },
      {
        id: "sample_3",
        pickup: "Vadanappally Center",
        destination: "Guruvayur Temple",
        distance: 35.8,
        fare: 454,
        driver: {
          id: 4,
          name: "Mahesh T.",
          vehicle_number: "KL 47 D 2134"
        },
        status: "completed",
        bookingDate: "2024-01-13T08:15:00.000Z",
        completedDate: "2024-01-13T09:30:00.000Z",
        duration: 75,
        rating: 5,
        feedback: "Very comfortable ride"
      },
      {
        id: "sample_4",
        pickup: "Vadanappally Hospital",
        destination: "Kochi City Center",
        distance: 42.1,
        fare: 530,
        driver: {
          id: 5,
          name: "Krishnan M.",
          vehicle_number: "KL 47 E 9876"
        },
        status: "cancelled",
        bookingDate: "2024-01-12T16:45:00.000Z",
        completedDate: "2024-01-12T17:00:00.000Z"
      },
      {
        id: "sample_5",
        pickup: "Vadanappally School",
        destination: "Thrissur Bus Stand",
        distance: 25.3,
        fare: 329,
        driver: {
          id: 1,
          name: "Sunil P.",
          vehicle_number: "KL 47 B 5501"
        },
        status: "completed",
        bookingDate: "2024-01-11T12:00:00.000Z",
        completedDate: "2024-01-11T13:15:00.000Z",
        duration: 75,
        rating: 4,
        feedback: "On time and professional"
      }
    ];
    
    this.saveHistory(sampleData);
  }

  // Clear all history
  clearHistory(): void {
    localStorage.removeItem(this.getUserStorageKey());
  }

  private saveHistory(history: BookingHistoryItem[]): void {
    try {
      localStorage.setItem(this.getUserStorageKey(), JSON.stringify(history));
    } catch (error) {
      console.error('Error saving booking history:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const bookingHistoryManager = new BookingHistoryManager();

