import React, { useState } from 'react';
import { Bell, ChevronUp, ChevronDown } from 'lucide-react';

export default function SearchFiltersSidebar({ filters, onFilterChange }) {
  const [sectionsOpen, setSectionsOpen] = useState({
    stops: true,
    baggage: true,
    departureTimes: true,
    duration: true,
    layovers: true
  });

  const toggleSection = (sec) => {
    setSectionsOpen(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleStopToggle = (stopVal) => {
    let current = [...filters.stops];
    if (current.includes(stopVal)) {
      current = current.filter(s => s !== stopVal);
    } else {
      current.push(stopVal);
    }
    onFilterChange({ ...filters, stops: current });
  };

  const handleBaggageToggle = (bagVal) => {
    let current = [...filters.baggage];
    if (current.includes(bagVal)) {
      current = current.filter(b => b !== bagVal);
    } else {
      current.push(bagVal);
    }
    onFilterChange({ ...filters, baggage: current });
  };

  const selectAllBaggage = () => {
    onFilterChange({ ...filters, baggage: ['cabin', 'checked'] });
  };

  const clearAllBaggage = () => {
    onFilterChange({ ...filters, baggage: [] });
  };

  return (
    <aside className="w-full lg:w-[260px] shrink-0 space-y-4">
      
      {/* Get Price Alerts CTA Button */}
      <button 
        type="button"
        className="w-full bg-[#FFEFEB] hover:bg-[#FFE5DB] border border-[#FFD8C7] text-[#FF5722] py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2.5 shadow-xs transition active:scale-[0.99]"
      >
        <Bell className="w-4 h-4 fill-[#FF5722] text-[#FF5722]" />
        <span>Get Price Alerts</span>
      </button>

      {/* Filter Card Container */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs divide-y divide-gray-100">
        
        {/* 1. Stops Filter */}
        <div className="pb-5">
          <div 
            onClick={() => toggleSection('stops')}
            className="flex items-center justify-between cursor-pointer py-1 select-none"
          >
            <h4 className="font-extrabold text-[#0F172A] text-base">Stops</h4>
            {sectionsOpen.stops ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>

          {sectionsOpen.stops && (
            <div className="mt-3.5 space-y-3">
              <label className="flex items-center justify-between text-sm cursor-pointer select-none group">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('direct')}
                    onChange={() => handleStopToggle('direct')}
                    className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900 group-hover:text-gray-950">Direct</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">from ₹72,299</span>
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none group">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('1stop')}
                    onChange={() => handleStopToggle('1stop')}
                    className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900 group-hover:text-gray-950">1 stop</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">from ₹59,725</span>
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none group">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('2stops')}
                    onChange={() => handleStopToggle('2stops')}
                    className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900 group-hover:text-gray-950">2+ stops</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">from ₹53,990</span>
              </label>
            </div>
          )}
        </div>

        {/* 2. Baggage Filter */}
        <div className="py-5">
          <div 
            onClick={() => toggleSection('baggage')}
            className="flex items-center justify-between cursor-pointer py-1 select-none"
          >
            <h4 className="font-extrabold text-[#0F172A] text-base">Baggage</h4>
            {sectionsOpen.baggage ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>

          {sectionsOpen.baggage && (
            <div className="mt-2.5 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <button onClick={selectAllBaggage} className="hover:text-gray-900 underline">Select all</button>
                <span>|</span>
                <button onClick={clearAllBaggage} className="hover:text-gray-900 underline">Clear all</button>
              </div>

              <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.baggage.includes('cabin')}
                  onChange={() => handleBaggageToggle('cabin')}
                  className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                />
                <span className="font-medium text-gray-800">Cabin bag</span>
              </label>

              <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.baggage.includes('checked')}
                  onChange={() => handleBaggageToggle('checked')}
                  className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                />
                <span className="font-medium text-gray-800">Checked bag</span>
              </label>
            </div>
          )}
        </div>

        {/* 3. Departure Times Filter */}
        <div className="py-5">
          <div 
            onClick={() => toggleSection('departureTimes')}
            className="flex items-center justify-between cursor-pointer py-1 select-none"
          >
            <h4 className="font-extrabold text-[#0F172A] text-base">Departure times</h4>
            {sectionsOpen.departureTimes ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>

          {sectionsOpen.departureTimes && (
            <div className="mt-3.5 space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-900">Outbound</div>
                <div className="text-xs text-gray-500 mt-0.5">00:00 – 23:59</div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  defaultValue="24"
                  className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>

              <div>
                <div className="text-xs font-bold text-gray-900">Return</div>
                <div className="text-xs text-gray-500 mt-0.5">00:00 – 23:59</div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  defaultValue="24"
                  className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Journey Duration */}
        <div className="py-5">
          <div 
            onClick={() => toggleSection('duration')}
            className="flex items-center justify-between cursor-pointer py-1 select-none"
          >
            <h4 className="font-extrabold text-[#0F172A] text-base">Journey duration</h4>
            {sectionsOpen.duration ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>

          {sectionsOpen.duration && (
            <div className="mt-3">
              <div className="text-xs text-gray-600 font-medium">10.5 hours – 36.5 hours</div>
              <input
                type="range"
                min="10"
                max="36"
                defaultValue="36"
                className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer mt-3"
              />
            </div>
          )}
        </div>

        {/* 5. Layovers */}
        <div className="pt-5">
          <div 
            onClick={() => toggleSection('layovers')}
            className="flex items-center justify-between cursor-pointer py-1 select-none"
          >
            <h4 className="font-extrabold text-[#0F172A] text-base">Layovers</h4>
            {sectionsOpen.layovers ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>

          {sectionsOpen.layovers && (
            <div className="mt-3.5 space-y-3">
              <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                />
                <span className="font-medium text-gray-800">Short layover (up to 4h)</span>
              </label>

              <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                />
                <span className="font-medium text-gray-800">Long layover (4h+)</span>
              </label>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}
