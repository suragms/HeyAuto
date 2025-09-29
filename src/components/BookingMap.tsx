import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface BookingMapProps {
  userLocation: [number, number] | null;
  className?: string;
}

const BookingMap: React.FC<BookingMapProps> = ({ userLocation, className = "" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map only if it doesn't exist
    if (!map.current) {
      map.current = L.map(mapContainer.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
      }).setView(userLocation, 16);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);

      // Create custom icon
      const customIcon = L.divIcon({
        html: '<div class="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>',
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add marker
      marker.current = L.marker(userLocation, { icon: customIcon }).addTo(map.current);
    } else {
      // Update existing map
      map.current.setView(userLocation, 16);
      if (marker.current) {
        marker.current.setLatLng(userLocation);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  if (!userLocation) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Locating you...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={`rounded-lg overflow-hidden ${className}`} />;
};

export default BookingMap;