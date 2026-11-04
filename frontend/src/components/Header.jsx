import React, { useState } from 'react';
import { Plane, Bed, Car, Heart, ChevronDown, Send } from 'lucide-react';

export default function Header({ currentTab = 'Flights', onSelectTab, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState(currentTab);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [selectedLang, setSelectedLang] = useState('English (IN)');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Segmented Tabs */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          {/* Logo */}
          <button 
            onClick={onNavigateHome}
            className="flex items-center space-x-2 focus:outline-none group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4 text-white fill-white -rotate-45 translate-x-px" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#0F172A] font-sans">
              Flyhigh
            </span>
          </button>

          {/* Nav pill tabs: Flights, Stays, Cars */}
          <nav className="flex items-center space-x-2.5">
            <button
              onClick={() => handleTabClick('Flights')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all shadow-xs ${
                activeTab === 'Flights'
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Plane className="w-4 h-4 fill-current stroke-[2.5]" />
              <span>Flights</span>
            </button>

            <button
              onClick={() => handleTabClick('Stays')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'Stays'
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Bed className="w-4 h-4" />
              <span>Stays</span>
            </button>

            <button
              onClick={() => handleTabClick('Cars')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'Cars'
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Cars</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Help, Language/Currency Picker, Favorites, Login */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Help
          </a>

          {/* Language & Currency Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{selectedLang}</span>
              <span className="inline-flex items-center justify-center text-xs">🇮🇳</span>
              <span className="font-semibold text-gray-900">{selectedCurrency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm">
                <button
                  onClick={() => { setSelectedLang('English (IN)'); setSelectedCurrency('INR'); setShowLangMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between"
                >
                  <span>English (IN) - ₹ INR</span>
                  <span>🇮🇳</span>
                </button>
                <button
                  onClick={() => { setSelectedLang('English (UK)'); setSelectedCurrency('GBP'); setShowLangMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between"
                >
                  <span>English (UK) - £ GBP</span>
                  <span>🇬🇧</span>
                </button>
                <button
                  onClick={() => { setSelectedLang('English (US)'); setSelectedCurrency('USD'); setShowLangMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between"
                >
                  <span>English (US) - $ USD</span>
                  <span>🇺🇸</span>
                </button>
              </div>
            )}
          </div>

          {/* Wishlist / Heart Icon */}
          <button 
            className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Saved trips"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Log In Button */}
          <button className="px-5 py-1.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all">
            Log in
          </button>
        </div>

      </div>
    </header>
  );
}
