import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PopularRoutesSection from '../components/PopularRoutesSection';
import FareAlertsAndAirlines from '../components/FareAlertsAndAirlines';

export default function HomePage({ onSearch, onSelectPopularRoute }) {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero with flight search */}
      <HeroSection onSearch={onSearch} />

      {/* Feature highlight cards and action cards */}
      <FeaturesSection />

      {/* Popular routes from UK */}
      <PopularRoutesSection onSelectRoute={onSelectPopularRoute} />

      {/* Exclusive Fare Alerts banner and Airline partner logos */}
      <FareAlertsAndAirlines />
    </div>
  );
}
