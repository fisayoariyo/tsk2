import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PopularRoutesSection from '../components/PopularRoutesSection';
import FareAlertsAndAirlines from '../components/FareAlertsAndAirlines';

export default function HomePage({ onSearch, onSelectPopularRoute, onNavigateHome }) {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero with flight search */}
      <HeroSection onSearch={onSearch} />

      {/* Below-hero content stays under search dropdowns */}
      <div className="relative z-0">
        <FeaturesSection onNavigateHome={onNavigateHome} />
        <PopularRoutesSection onSelectRoute={onSelectPopularRoute} />
        <FareAlertsAndAirlines />
      </div>
    </div>
  );
}
