import React, { useState } from 'react';
import { Heart, Globe, ArrowRight, Info, ChevronDown } from 'lucide-react';

export default function FlightResultsList({
  flights = [],
  sortBy = 'best',
  onSortChange,
  onSelectFlight
}) {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (flightKey, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [flightKey]: !prev[flightKey] }));
  };

  return (
    <div className="flex-1 min-w-0 space-y-4">
      
      {/* Results Header: Count & Sort indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700 font-medium">
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-gray-900">126 results</span>
          <span>sorted by:</span>
          <span className="font-bold text-gray-900">Best</span>
          <button title="Sorting explanation" className="text-gray-400 hover:text-gray-600">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-xs sm:text-sm font-semibold">
          <span>Show price per traveller</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* Top 4 Sort Tabs (Best, Cheapest, Fastest, Sort dropdown) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-4 divide-x divide-gray-100">
        
        {/* Tab 1: Best (Active Orange) */}
        <button
          onClick={() => onSortChange('best')}
          className={`p-3 sm:py-3.5 sm:px-4 text-left transition-all ${
            sortBy === 'best'
              ? 'bg-[#FF5722] text-white shadow-inner'
              : 'hover:bg-gray-50 text-gray-900'
          }`}
        >
          <div className="text-xs sm:text-sm font-bold">Best</div>
          <div className="text-base sm:text-lg font-black tracking-tight leading-snug">₹72,299</div>
          <div className={`text-[11px] sm:text-xs font-medium ${sortBy === 'best' ? 'text-white/90' : 'text-gray-500'}`}>
            6h 20m (avg)
          </div>
        </button>

        {/* Tab 2: Cheapest */}
        <button
          onClick={() => onSortChange('cheapest')}
          className={`p-3 sm:py-3.5 sm:px-4 text-left transition-all ${
            sortBy === 'cheapest'
              ? 'bg-[#FF5722] text-white shadow-inner'
              : 'hover:bg-gray-50 text-gray-900'
          }`}
        >
          <div className="text-xs sm:text-sm font-bold">Cheapest</div>
          <div className="text-base sm:text-lg font-black tracking-tight leading-snug">₹59,725</div>
          <div className={`text-[11px] sm:text-xs font-medium ${sortBy === 'cheapest' ? 'text-white/90' : 'text-gray-500'}`}>
            14h 30m (avg)
          </div>
        </button>

        {/* Tab 3: Fastest */}
        <button
          onClick={() => onSortChange('fastest')}
          className={`p-3 sm:py-3.5 sm:px-4 text-left transition-all ${
            sortBy === 'fastest'
              ? 'bg-[#FF5722] text-white shadow-inner'
              : 'hover:bg-gray-50 text-gray-900'
          }`}
        >
          <div className="text-xs sm:text-sm font-bold">Fastest</div>
          <div className="text-base sm:text-lg font-black tracking-tight leading-snug">₹144,983</div>
          <div className={`text-[11px] sm:text-xs font-medium ${sortBy === 'fastest' ? 'text-white/90' : 'text-gray-500'}`}>
            6h 20m (avg)
          </div>
        </button>

        {/* Tab 4: Sort Dropdown */}
        <div className="p-3 sm:py-3.5 sm:px-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span className="text-xs sm:text-sm font-bold">Sort</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

      </div>

      {/* Flyhigh Picks Banner */}
      <div className="bg-[#FFF3EC] border border-[#FFE2D4] rounded-2xl p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[#FF5722]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">See the world differently</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              More flight options, better fares and flexible travel, only on Flyhigh.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-orange-300 bg-white/70 text-[#FF5722] text-xs font-bold shrink-0 self-end sm:self-center">
          <span>☆</span>
          <span>Flyhigh Picks</span>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-3.5">
        {flights.map((flight) => {
          const isFavorited = favorites[flight.key];
          const isAirIndia = flight.carrier === 'AI';

          return (
            <div
              key={flight.key}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition-all group relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left/Middle: Airline Info & Flight Legs */}
                <div className="flex-1 space-y-4">
                  
                  {/* Airline Header Row */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={flight.logo}
                      alt={flight.carrierName}
                      className="h-6 sm:h-7 object-contain max-w-[100px]"
                    />
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {flight.carrierName}
                    </span>
                  </div>

                  {/* Outbound Leg */}
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-8 text-sm">
                    {/* Departure */}
                    <div className="w-18 sm:w-20">
                      <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                        {flight.outbound.departureTime}
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {flight.outbound.fromCode}
                      </div>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="flex-1 max-w-[180px] sm:max-w-[220px] text-center">
                      <div className="text-xs font-medium text-gray-500">
                        {flight.outbound.duration}
                      </div>
                      
                      <div className="relative my-1 flex items-center">
                        <div className="w-full h-[1.5px] bg-gray-300"></div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 absolute right-0" />
                      </div>

                      <div className={`text-xs font-bold ${flight.outbound.stops === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {flight.outbound.stopType}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="w-20 sm:w-24 text-right sm:text-left">
                      <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                        {flight.outbound.arrivalTime}
                        {flight.outbound.dayOffset && (
                          <span className="text-xs font-bold text-gray-700 align-super ml-0.5">
                            {flight.outbound.dayOffset}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {flight.outbound.toCode}
                      </div>
                    </div>
                  </div>

                  {/* Inbound Leg (Return) */}
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-8 text-sm pt-1 border-t border-gray-100/70">
                    {/* Departure */}
                    <div className="w-18 sm:w-20">
                      <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                        {flight.inbound.departureTime}
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {flight.inbound.fromCode}
                      </div>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="flex-1 max-w-[180px] sm:max-w-[220px] text-center">
                      <div className="text-xs font-medium text-gray-500">
                        {flight.inbound.duration}
                      </div>
                      
                      <div className="relative my-1 flex items-center">
                        <div className="w-full h-[1.5px] bg-gray-300"></div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 absolute right-0" />
                      </div>

                      <div className={`text-xs font-bold ${flight.inbound.stops === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {flight.inbound.stopType}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="w-20 sm:w-24 text-right sm:text-left">
                      <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                        {flight.inbound.arrivalTime}
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {flight.inbound.toCode}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Price & CTA Button */}
                <div className="lg:border-l lg:border-gray-150 lg:pl-6 pt-3 lg:pt-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center shrink-0 space-y-2">
                  
                  {/* Heart wishlist button in card */}
                  <button
                    onClick={(e) => toggleFavorite(flight.key, e)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </button>

                  <div className="text-left lg:text-right">
                    <div className="text-[11px] text-gray-500 font-medium">Return per traveller from</div>
                    <div className="text-xl sm:text-2xl font-black text-[#FF5722] tracking-tight">
                      {flight.formattedPrice}
                    </div>
                  </div>

                  {/* Select button: Air India has vibrant orange button `#FF5722`, others have dark navy `#0F2038` as in mockup */}
                  <button
                    onClick={() => onSelectFlight(flight)}
                    className={`flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition active:scale-[0.98] ${
                      isAirIndia
                        ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-orange-500/20'
                        : 'bg-[#0F2038] hover:bg-[#1A2E4C] text-white'
                    }`}
                  >
                    <span>Select</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
