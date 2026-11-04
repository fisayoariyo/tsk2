import React from 'react';
import { Ticket, Zap, ShieldCheck, Headphones, ChevronRight, TowerControl, Users } from 'lucide-react';

export default function FeaturesSection({ onNavigateHome }) {
  const features = [
    {
      id: 1,
      title: 'Best Flight Deals',
      subtitle: 'Compare 100+ airlines',
      icon: Ticket
    },
    {
      id: 2,
      title: 'Book Instantly',
      subtitle: 'Quick & secure booking',
      icon: Zap
    },
    {
      id: 3,
      title: 'Trusted & Safe',
      subtitle: 'Your trips, our priority',
      icon: ShieldCheck
    },
    {
      id: 4,
      title: '24x7 Support',
      subtitle: "We're here to help",
      icon: Headphones
    }
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12 pt-7 pb-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-6 font-medium">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-gray-900 underline underline-offset-2"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-gray-900 underline underline-offset-2 text-[#FF5722]"
        >
          Flights
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">United Kingdom</span>
      </nav>

      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-6">
        Cheap flights from United Kingdom
      </h2>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-orange-200 transition-all duration-200 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-[#FFF5ED] border border-orange-100 flex items-center justify-center shrink-0 p-3 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-[#FF5722]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Quick Navigation Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Airports Card */}
        <button
          type="button"
          className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-orange-200 transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF5ED] border border-orange-100 flex items-center justify-center shrink-0 p-3">
              <TowerControl className="w-7 h-7 text-[#FF5722]" strokeWidth={2} />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Airports in<br />United Kingdom
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Who Flies Card */}
        <button
          type="button"
          className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-orange-200 transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF5ED] border border-orange-100 flex items-center justify-center shrink-0 p-3">
              <Users className="w-7 h-7 text-[#FF5722]" strokeWidth={2} />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Who flies to<br />United Kingdom
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </button>

      </div>

    </section>
  );
}
