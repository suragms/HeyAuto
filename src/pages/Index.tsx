import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingInterface from '@/components/BookingInterface';
import BookingHistory from '@/components/BookingHistory';
import NavigationHeader from '@/components/NavigationHeader';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'history'>('home');
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'history') => {
    setCurrentPage(page);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onProfileClick={handleProfileClick}
      />
      
      <div className="-mt-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-kerala-green/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {currentPage === 'home' ? (
            <BookingInterface />
          ) : (
            <BookingHistory onBack={() => setCurrentPage('home')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;