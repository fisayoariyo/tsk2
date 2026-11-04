import React, { useState } from 'react';
import { Plane, Bed, Car, Heart, ChevronDown, Send } from 'lucide-react';
import { LOCALES, getLocaleById } from '../data/locales';
import FlagIcon from './FlagIcon';

export default function Header({ currentTab = 'Flights', onSelectTab, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState(currentTab);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localeId, setLocaleId] = useState('in');

  const locale = getLocaleById(localeId);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const tabs = [
    { id: 'Flights', Icon: Plane, fill: true },
    { id: 'Stays', Icon: Bed, fill: false },
    { id: 'Cars', Icon: Car, fill: false }
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Primary bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* Logo */}
        <button 
          onClick={onNavigateHome}
          className="flex items-center space-x-2 focus:outline-none group text-left shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white -rotate-45 translate-x-px" strokeWidth={2} />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] font-sans">
            Flyhigh
          </span>
        </button>

        {/* Desktop nav tabs */}
        <nav className="hidden md:flex items-center space-x-2.5 flex-1 ml-6 lg:ml-8">
          {tabs.map(({ id, Icon, fill }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${fill ? 'fill-current stroke-[2.5]' : ''}`} />
              <span>{id}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="hidden lg:inline text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Help
          </a>

          {/* Language / currency — compact on mobile (flag + currency only) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label={`${locale.lang} ${locale.currency}`}
            >
              <span className="hidden sm:inline">{locale.lang}</span>
              <FlagIcon Flag={locale.Flag} title={locale.countryCode} className="w-5 h-3.5" />
              <span className="font-semibold text-gray-900">{locale.currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm">
                {LOCALES.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setLocaleId(opt.id); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center justify-between gap-3 ${
                      localeId === opt.id ? 'text-orange-600 bg-orange-50/60' : 'text-gray-800'
                    }`}
                  >
                    <span className="font-medium">
                      {opt.lang} · {opt.symbol} {opt.currency}
                    </span>
                    <FlagIcon Flag={opt.Flag} title={opt.countryCode} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="hidden sm:inline-flex p-1.5 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Saved trips"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button className="px-3 sm:px-5 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap">
            Log in
          </button>
        </div>
      </div>

      {/* Mobile category tabs — second row */}
      <div className="md:hidden border-t border-gray-100 px-4 pb-2.5 pt-2">
        <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {tabs.map(({ id, Icon, fill }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                activeTab === id
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${fill ? 'fill-current stroke-[2.5]' : ''}`} />
              <span>{id}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
