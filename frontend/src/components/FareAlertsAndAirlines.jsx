import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, ChevronRight } from 'lucide-react';

export default function FareAlertsAndAirlines() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  const airlines = [
    { name: 'British Airways', logo: '/logos/british-airways.svg' },
    { name: 'Emirates', logo: '/logos/emirates-thumb.png' },
    { name: 'Qatar Airways', logo: '/logos/qatar-airways.svg' },
    { name: 'Lufthansa', logo: '/logos/lufthansa-mark.svg' },
    { name: 'IndiGo', logo: '/logos/indigo.svg' },
    { name: 'Air India', logo: '/logos/air-india.svg' }
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12 py-6 space-y-12">
      
      {/* Exclusive Flight Deals & Fare Alerts Banner */}
      <div className="bg-[#FFF4EE] border border-[#FFE2D4] rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side Copy */}
        <div className="max-w-xl z-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E04006] tracking-tight leading-tight">
            Exclusive Flight Deals<br className="hidden sm:inline" /> & Fare Alerts
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mt-2 font-medium">
            Get the latest offers, price drops and travel deals from United Kingdom.
          </p>
        </div>

        {/* Right Side Input & Paper Plane Doodle */}
        <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end space-x-6 z-10">
          
          {subscribed ? (
            <div className="flex items-center space-x-2 bg-white px-6 py-3.5 rounded-2xl shadow-sm text-green-700 font-semibold border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>You're subscribed! Check your inbox for secret fares.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200 w-full sm:w-[420px] focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
              <div className="flex items-center pl-3.5 flex-1 min-w-0">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-0 focus:outline-none placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition active:scale-[0.98] shrink-0"
              >
                Notify Me
              </button>
            </form>
          )}

          {/* Paper Plane flight-path accent */}
          <div className="hidden sm:flex items-center shrink-0 opacity-80 text-[#FF5722]">
            <div className="w-10 border-t-2 border-dashed border-[#FF5722] mr-1" />
            <Send className="w-8 h-8 -rotate-12" strokeWidth={2} />
          </div>

        </div>

      </div>

      {/* Book with confidence Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-2 pb-4">
        
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight shrink-0">
          Book with confidence
        </h3>

        {/* Airline Logo Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-1 max-w-4xl">
          {airlines.map((airline) => (
            <div
              key={airline.name}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 h-12 min-w-[108px] flex items-center justify-center shadow-xs hover:border-gray-300 hover:shadow-sm transition"
              title={airline.name}
            >
              <img
                src={airline.logo}
                alt={airline.name}
                className="max-h-7 max-w-[100px] w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* View all airlines link */}
        <a
          href="#airlines"
          onClick={(e) => e.preventDefault()}
          className="text-[#FF5722] hover:text-[#E64A19] font-bold text-sm sm:text-base flex items-center space-x-1 shrink-0 transition"
        >
          <span>View all airlines</span>
          <ChevronRight className="w-5 h-5" />
        </a>

      </div>

    </section>
  );
}
