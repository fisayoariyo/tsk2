import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Users, Search, ChevronDown, Check } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';

export default function HeroSection({ onSearch, onCancel, initialQuery, variant = 'hero' }) {
  const bar = variant === 'bar';
  const panel = variant === 'panel';
  const embedded = panel || bar;
  const fieldId = (name) => `${bar ? 'bar' : panel ? 'edit' : 'home'}-${name}`;
  // Trip type: 'Round Trip' or 'One Way'
  const [tripType, setTripType] = useState(initialQuery?.tripType === 'O' ? 'One Way' : 'Round Trip');

  // Special fares
  const [specialFares, setSpecialFares] = useState(initialQuery?.specialFares || {
    defence: false,
    ltc: false,
    seniorCitizen: false,
    student: false
  });

  // Origin & Destination default to Mumbai (BOM) & Kolkata (CCU)
  const [origin, setOrigin] = useState(initialQuery?.from || 'Mumbai (BOM)');
  const [destination, setDestination] = useState(initialQuery?.to || 'Kolkata (CCU)');

  // Dates default to user's specified test flight: Dec 15 - 31, 2026
  const [departDate, setDepartDate] = useState(initialQuery?.departDate || '15/12/2026');
  const [returnDate, setReturnDate] = useState(initialQuery?.returnDate || '31/12/2026');

  // Travellers & Class default to user's test config: 8 travellers (2 adults, 4 children, 2 infants) in Business Class
  const [travellers, setTravellers] = useState(initialQuery?.travellers || { adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState(initialQuery?.cabinClass || 'Economy');
  const [showTravellerMenu, setShowTravellerMenu] = useState(false);

  const totalTravellers = travellers.adults + travellers.children + travellers.infants;
  const travellerSummary = `${totalTravellers} Traveller(s) ,${cabinClass}`;

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination || 'Kolkata (CCU)');
    setDestination(temp || 'Mumbai (BOM)');
  };

  const handleSpecialFareToggle = (key) => {
    setSpecialFares(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch({
        from: origin || 'Mumbai (BOM)',
        to: destination || 'Kolkata (CCU)',
        departDate,
        returnDate: tripType === 'Round Trip' ? returnDate : '',
        tripType: tripType === 'Round Trip' ? 'R' : 'O',
        travellers,
        cabinClass,
        specialFares
      });
    }
  };

  return (
    <div className={bar ? 'w-full bg-[#FF5722] py-3 px-4 sm:px-8 shadow-md' : panel ? 'relative z-30 w-full pt-4 pb-2 px-4 sm:px-8 lg:px-12' : 'relative z-20 w-full pt-8 pb-14 px-4 sm:px-8 lg:px-12'}>
      {/* Background with airport plane texture */}
      {!embedded && <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat scale-[1.02] filter brightness-90"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
      </div>}

      <div className="max-w-[1340px] mx-auto relative z-10">
        
        {/* IRCTC Air Hero Title */}
        {!embedded && <div className="mb-4">
          <div className="inline-flex items-center space-x-2 bg-amber-400/90 text-gray-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            <span>Official Flight Booking Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            Book Domestic & International Flights
          </h1>
          <p className="text-white/90 text-sm sm:text-base font-medium mt-0.5 drop-shadow-sm">
            Zero convenience fees for LTC bookings &bull; Guaranteed carrier inventory &bull; 24x7 Customer Support
          </p>
        </div>}

        {/* IRCTC Search Bar Card Container (ss2) */}
        <div className={bar ? '' : 'bg-white rounded-xl shadow-2xl p-4 sm:p-5 border border-gray-100'}>
          
          {/* Top Options Bar: One Way, Round Trip tabs & Special Fare Checkboxes (ss2) */}
          <div className={bar ? 'flex flex-wrap items-center justify-between gap-3 pb-2 text-sm' : 'flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-sm'}>
            
            {/* Trip Type Tabs */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setTripType('One Way')}
                className={`relative px-4 py-1.5 text-sm font-bold transition ${
                  bar
                    ? tripType === 'One Way' ? 'bg-white text-[#FF5722] rounded-full' : 'text-white rounded-full hover:bg-white/15'
                    : tripType === 'One Way' ? 'bg-[#FF5722] text-white rounded-t-md' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-t-md'
                }`}
              >
                One Way
                {!bar && tripType === 'One Way' && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[6px] border-t-[#FF5722]"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTripType('Round Trip')}
                className={`relative px-4 py-1.5 text-sm font-bold transition ${
                  bar
                    ? tripType === 'Round Trip' ? 'bg-white text-[#FF5722] rounded-full' : 'text-white rounded-full hover:bg-white/15'
                    : tripType === 'Round Trip' ? 'bg-[#FF5722] text-white rounded-t-md' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-t-md'
                }`}
              >
                Round Trip
                {!bar && tripType === 'Round Trip' && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[6px] border-t-[#FF5722]"></span>
                )}
              </button>
            </div>

            {/* Special Fare Checkboxes (ss2 & ss3) */}
            <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm ${bar ? 'text-white' : 'text-gray-800'}`}>
              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={specialFares.defence}
                  onChange={() => handleSpecialFareToggle('defence')}
                  className={`w-4 h-4 rounded border-gray-300 ${bar ? 'accent-white' : 'accent-[#FF5722]'}`}
                />
                <span className={`font-semibold ${bar ? 'text-white' : 'text-gray-800'}`}>Defence Fare</span>
              </label>

              {/* Govt Employee / LTC with highlighted yellow badge style as in ss2/ss3/ss4 */}
              <label className="flex items-center space-x-1.5 cursor-pointer select-none bg-[#FDB813] hover:bg-[#fab005] px-2.5 py-1 rounded transition text-gray-950 shadow-xs">
                <input
                  type="checkbox"
                  checked={specialFares.ltc}
                  onChange={() => handleSpecialFareToggle('ltc')}
                  className="w-4 h-4 rounded text-gray-950 focus:ring-gray-950 border-gray-900"
                />
                <span className="font-bold">Govt Employee/LTC</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={specialFares.seniorCitizen}
                  onChange={() => handleSpecialFareToggle('seniorCitizen')}
                  className={`w-4 h-4 rounded border-gray-300 ${bar ? 'accent-white' : 'accent-[#FF5722]'}`}
                />
                <span className={`font-semibold ${bar ? 'text-white' : 'text-gray-800'}`}>Senior Citizen</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={specialFares.student}
                  onChange={() => handleSpecialFareToggle('student')}
                  className={`w-4 h-4 rounded border-gray-300 ${bar ? 'accent-white' : 'accent-[#FF5722]'}`}
                />
                <span className={`font-semibold ${bar ? 'text-white' : 'text-gray-800'}`}>Student</span>
              </label>
            </div>

          </div>

          {/* Main Input Strip (ss2) */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-stretch">
            
            {/* Origin & Destination with Center Swap (5 cols on desktop) */}
            <div className="md:col-span-5 relative flex flex-col sm:flex-row items-stretch border border-gray-300 rounded-lg bg-white overflow-visible">
              
              {/* Origin Autocomplete (ss3) */}
              <div className="flex-1 min-w-0 px-3 py-2 sm:border-r border-gray-200">
                <AirportAutocomplete
                  id={fieldId('origin')}
                  label="Origin"
                  placeholder="Origin"
                  value={origin}
                  onChange={setOrigin}
                />
              </div>

              {/* Central Swap Button (ss2 yellow circle with horizontal arrows) */}
              <button
                type="button"
                onClick={handleSwap}
                className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FDB813] hover:bg-[#fab005] text-gray-950 flex items-center justify-center shadow-md transition-transform active:rotate-180 self-center my-1 sm:my-0 cursor-pointer"
                title="Swap origin and destination"
                aria-label="Swap origin and destination"
              >
                <ArrowLeftRight className="w-4 h-4 stroke-[2.25]" />
              </button>

              {/* Destination Autocomplete (ss4) */}
              <div className="flex-1 min-w-0 px-3 py-2 sm:pl-5">
                <AirportAutocomplete
                  id={fieldId('destination')}
                  label="Destination"
                  placeholder="Destination"
                  value={destination}
                  onChange={setDestination}
                />
              </div>

            </div>

            {/* Departure Date (2 cols) */}
            <div className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 bg-white flex flex-col justify-center">
              <label htmlFor={fieldId('depart')} className="block text-[11px] font-semibold text-gray-500 tracking-wide mb-0.5">
                Departure
              </label>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  id={fieldId('depart')}
                  type="text"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full text-sm font-bold text-gray-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Return Date (2 cols, disabled if One Way) */}
            <div className={`md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 bg-white flex flex-col justify-center ${
              tripType === 'One Way' ? 'pointer-events-none' : ''
            }`}>
              <label htmlFor={fieldId('return')} className={`block text-[11px] font-semibold tracking-wide mb-0.5 ${tripType === 'One Way' ? 'text-gray-400' : 'text-gray-500'}`}>
                Return
              </label>
              <div className={`flex items-center space-x-1.5 ${tripType === 'One Way' ? 'opacity-50' : ''}`}>
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  id={fieldId('return')}
                  type="text"
                  disabled={tripType === 'One Way'}
                  value={tripType === 'One Way' ? '' : returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full text-sm font-bold text-gray-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Travellers & Cabin Class (3 cols, matching ss2: "1 Traveller(s) ,Economy") */}
            <div className="md:col-span-3 relative flex items-stretch">
              
              <button
                type="button"
                onClick={() => setShowTravellerMenu(!showTravellerMenu)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white flex flex-col justify-center text-left hover:border-gray-400 transition"
              >
                <span className="block text-[11px] font-semibold text-gray-500 tracking-wide mb-0.5">
                  Traveller & Class
                </span>
                <span className="block text-sm font-bold text-gray-900 truncate">
                  {travellerSummary}
                </span>
              </button>

              {/* Travellers Dropdown Selector Popover */}
              {showTravellerMenu && (
                <div className="absolute right-0 top-full mt-2 w-[290px] sm:w-[320px] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 text-sm space-y-3.5 animate-in fade-in duration-150">
                  
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Adults</div>
                      <div className="text-[11px] text-gray-500">12+ years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, adults: Math.max(1, t.adults - 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-gray-900">{travellers.adults}</span>
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, adults: Math.min(9, t.adults + 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Children</div>
                      <div className="text-[11px] text-gray-500">2-12 years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, children: Math.max(0, t.children - 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-gray-900">{travellers.children}</span>
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, children: Math.min(9, t.children + 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Infants</div>
                      <div className="text-[11px] text-gray-500">Under 2 years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, infants: Math.max(0, t.infants - 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-gray-900">{travellers.infants}</span>
                      <button
                        type="button"
                        onClick={() => setTravellers(t => ({ ...t, infants: Math.min(9, t.infants + 1) }))}
                        className="w-7 h-7 rounded-full border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cabin Class */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs font-bold text-gray-700 mb-2">Class of Travel</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Economy', 'Premium', 'Business'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setCabinClass(cls)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                            cabinClass === cls
                              ? 'bg-[#FF5722] text-white border-[#FF5722]'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTravellerMenu(false)}
                    className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-2 rounded-lg text-sm transition"
                  >
                    Done
                  </button>

                </div>
              )}

              {/* Yellow Search Pill Button (ss2: "Search Q") */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="ml-2 bg-[#FDB813] hover:bg-[#fab005] text-gray-950 font-black px-5 py-2.5 rounded-full flex items-center space-x-1.5 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer shrink-0"
              >
                <span>{embedded ? 'Modify' : 'Search'}</span>
                <Search className="w-4 h-4 stroke-[2.75]" />
              </button>
              {panel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-2 min-h-11 px-3 text-sm font-bold text-gray-600 hover:text-gray-950"
                >
                  Cancel
                </button>
              )}

            </div>

          </div>

          {/* Red Mandatory Government LTC Notice (ss2, ss3, ss4) */}
          {!bar && <div className="mt-3 pt-2 text-center text-xs font-semibold text-red-600">
            Government Employees are mandated to book air tickets under the 'Government Employee/LTC' tab ONLY for Official or LTC travel where the Government of India bears the cost as per the GOI guidelines.
          </div>}

        </div>

      </div>

    </div>
  );
}
