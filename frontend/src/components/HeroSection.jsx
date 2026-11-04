import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, User, Search, ChevronDown, Check } from 'lucide-react';

export default function HeroSection({ onSearch }) {
  const [tripType, setTripType] = useState('Return');
  const [showTripTypeMenu, setShowTripTypeMenu] = useState(false);
  
  const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState('Economy');
  const [showTravellerMenu, setShowTravellerMenu] = useState(false);

  const [fromLocation, setFromLocation] = useState('United Kingdom (UK)');
  const [toLocation, setToLocation] = useState('');
  const [departDate, setDepartDate] = useState('09/11/2026');
  const [returnDate, setReturnDate] = useState('16/11/2026');

  const [addNearbyFrom, setAddNearbyFrom] = useState(false);
  const [addNearbyTo, setAddNearbyTo] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);

  const travellerSummary = `${travellers.adults} Adult${travellers.adults > 1 ? 's' : ''}, ${cabinClass}`;

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation || 'Mumbai (BOM)');
    setToLocation(temp || 'London (LHR)');
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch({
        from: fromLocation,
        to: toLocation || 'Mumbai (BOM)',
        departDate,
        returnDate,
        tripType,
        travellers,
        cabinClass,
        directOnly
      });
    }
  };

  return (
    <div className="relative w-full pt-8 pb-14 px-6 sm:px-10 lg:px-12 overflow-hidden shadow-inner">
      {/* Full-bleed hero photographic background (attached airliner banner) */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat scale-[1.02]"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Light left wash only — keeps headline readable without hiding the plane */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#E84A1A]/45) via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-[1320px] mx-auto relative z-10">
        
        {/* Headline & Subhead */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Cheap flights from United Kingdom
          </h1>
          <p className="text-white/95 text-base sm:text-lg font-medium mt-1 tracking-wide drop-shadow-sm">
            Compare fares &nbsp;•&nbsp; Book instantly &nbsp;•&nbsp; Best deals
          </p>
        </div>

        {/* Search Widget Container */}
        <div className="space-y-2.5">
          
          {/* Top Options Row: Trip Type Pill & Adult Count Pill */}
          <div className="flex items-center space-x-2">
            
            {/* Trip Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowTripTypeMenu(!showTripTypeMenu); setShowTravellerMenu(false); }}
                className="flex items-center space-x-1.5 bg-white text-gray-800 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition"
              >
                <span>{tripType}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showTripTypeMenu && (
                <div className="absolute left-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 text-sm">
                  {['Return', 'One-way', 'Multi-city'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setTripType(type); setShowTripTypeMenu(false); }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between"
                    >
                      <span>{type}</span>
                      {tripType === type && <Check className="w-3.5 h-3.5 text-orange-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Travellers Quick Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowTravellerMenu(!showTravellerMenu); setShowTripTypeMenu(false); }}
                className="flex items-center space-x-1.5 bg-white text-gray-800 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition"
              >
                <span>{travellers.adults} Adult{travellers.adults > 1 ? 's' : ''}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

          </div>

          {/* Main Search Input Strip Card */}
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4">
            
            <div className="flex flex-col xl:flex-row xl:items-stretch gap-2">
              
              {/* From + To pair with overlapping swap — widest segment */}
              <div className="relative flex flex-col sm:flex-row flex-[1.7] min-w-0 gap-2 sm:gap-0">
                {/* From */}
                <div className="flex-1 min-w-0 border border-gray-200 sm:border-r-0 sm:rounded-l-xl sm:rounded-r-none rounded-xl px-3.5 py-2.5 hover:border-gray-300 transition bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 sm:pr-6">
                  <label className="block text-[11px] font-semibold text-[#FF5722] tracking-wide">
                    From
                  </label>
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Country, city or airport"
                    className="w-full text-sm font-bold text-gray-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* To */}
                <div className="flex-1 min-w-0 border border-gray-200 sm:rounded-r-xl sm:rounded-l-none rounded-xl px-3.5 py-2.5 hover:border-gray-300 transition bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 sm:pl-6">
                  <label className="block text-[11px] font-semibold text-gray-600 tracking-wide">
                    To
                  </label>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Country, city or airport"
                    className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Swap — centered exactly on the From/To seam */}
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border-2 border-[#FF5722] bg-white text-[#FF5722] hover:bg-orange-50 flex items-center justify-center shadow-sm transition-transform active:rotate-180 duration-200"
                  title="Swap origin and destination"
                >
                  <ArrowLeftRight className="w-4 h-4" strokeWidth={2.25} />
                </button>
              </div>

              {/* Depart — narrower */}
              <div className="xl:w-[128px] xl:flex-none min-w-0 border border-gray-200 rounded-xl px-2.5 py-2.5 hover:border-gray-300 transition bg-white flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-wide">
                    Depart
                  </label>
                  <input
                    type="text"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full text-sm font-bold text-gray-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Return — narrower */}
              <div className={`xl:w-[128px] xl:flex-none min-w-0 border border-gray-200 rounded-xl px-2.5 py-2.5 hover:border-gray-300 transition bg-white flex items-center space-x-1.5 ${tripType === 'One-way' ? 'opacity-40 pointer-events-none' : ''}`}>
                <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-wide">
                    Return
                  </label>
                  <input
                    type="text"
                    value={returnDate}
                    disabled={tripType === 'One-way'}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full text-sm font-bold text-gray-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Travellers & cabin class — keep existing width */}
              <div className="relative xl:w-[210px] xl:flex-none min-w-0">
                <button
                  type="button"
                  onClick={() => { setShowTravellerMenu(!showTravellerMenu); setShowTripTypeMenu(false); }}
                  className="w-full h-full border border-gray-200 rounded-xl px-3 py-2.5 hover:border-gray-300 transition bg-white flex items-center space-x-2 text-left"
                >
                  <User className="w-4 h-4 text-gray-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-semibold text-gray-500 tracking-wide">
                      Travellers & cabin class
                    </span>
                    <span className="block text-sm font-bold text-gray-900 truncate">
                      {travellerSummary}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </button>

                {showTravellerMenu && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-40 text-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Adults</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50"
                          onClick={() => setTravellers((t) => ({ ...t, adults: Math.max(1, t.adults - 1) }))}
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-semibold">{travellers.adults}</span>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50"
                          onClick={() => setTravellers((t) => ({ ...t, adults: Math.min(9, t.adults + 1) }))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">Cabin class</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Economy', 'Premium', 'Business', 'First'].map((cabin) => (
                          <button
                            key={cabin}
                            type="button"
                            onClick={() => setCabinClass(cabin)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              cabinClass === cabin
                                ? 'bg-orange-50 border-orange-300 text-orange-700'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {cabin}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTravellerMenu(false)}
                      className="w-full bg-[#FF5722] text-white text-sm font-bold py-2 rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Search — slightly tighter */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="xl:w-[112px] shrink-0 flex items-center justify-center space-x-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white py-3.5 px-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>Search</span>
              </button>

            </div>

            {/* Checkboxes only under the strip */}
            <div className="mt-3 pt-1 flex flex-wrap items-center gap-5 text-gray-700">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addNearbyFrom}
                  onChange={(e) => setAddNearbyFrom(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="font-medium text-xs sm:text-sm">Add nearby airports (from)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addNearbyTo}
                  onChange={(e) => setAddNearbyTo(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="font-medium text-xs sm:text-sm">Add nearby airports (to)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={(e) => setDirectOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="font-medium text-xs sm:text-sm">Direct flights only</span>
              </label>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
