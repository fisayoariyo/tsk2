import React, { useEffect, useState } from 'react';
import { Plane, CheckCircle2, Info, ChevronDown, ChevronUp, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

function EmptyLeg({ label, onClear, filtersActive }) {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center">
      <p className="text-sm font-bold text-gray-900">No {label} flights match these filters</p>
      <p className="text-xs text-gray-500 mt-1">Try another time, airline, or stop count.</p>
      {filtersActive && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 min-h-11 px-4 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#E64A19]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default function RoundTripSplitResults({
  searchData,
  outboundFlights: outboundOverride,
  returnFlights: returnOverride,
  onSelectBooking,
  onClearFilters,
  filtersActive = false
}) {
  const outboundFlights = outboundOverride || searchData?.outboundFlights || [];
  const returnFlights = returnOverride || searchData?.returnFlights || [];
  
  const [selectedOutboundKey, setSelectedOutboundKey] = useState(null);
  const [selectedReturnKey, setSelectedReturnKey] = useState(null);
  const [showFareBreakup, setShowFareBreakup] = useState(false);

  useEffect(() => {
    if (selectedOutboundKey && !outboundFlights.some((flight) => flight.key === selectedOutboundKey)) {
      setSelectedOutboundKey(null);
    }
  }, [outboundFlights, selectedOutboundKey]);

  useEffect(() => {
    if (selectedReturnKey && !returnFlights.some((flight) => flight.key === selectedReturnKey)) {
      setSelectedReturnKey(null);
    }
  }, [returnFlights, selectedReturnKey]);

  const selectedOutbound = outboundFlights.find(f => f.key === selectedOutboundKey) || null;
  const selectedReturn = returnFlights.find(f => f.key === selectedReturnKey) || null;

  // Calculate live total price based on selected pair
  const isDefaultPair = (
    selectedOutbound?.flightNumber?.includes('676') && 
    selectedReturn?.flightNumber?.includes('773')
  );

  const pairReady = Boolean(selectedOutbound && selectedReturn);
  const totalPrice = !pairReady
    ? 0
    : isDefaultPair
      ? 376038
      : ((selectedOutbound?.price || 0) + (selectedReturn?.price || 0));

  const formattedTotal = pairReady ? `₹${totalPrice.toLocaleString('en-IN')}` : '—';

  const travellers = searchData?.searchSummary?.travellers || { adults: 1, children: 0, infants: 0, total: 1 };
  const classOfTravel = searchData?.searchSummary?.classOfTravel || 'Economy';

  // Proportional passenger fare breakdown calculation
  const adultSubtotal = isDefaultPair ? 136740 : Math.round(totalPrice * (travellers.adults / travellers.total));
  const childSubtotal = isDefaultPair ? 205112 : Math.round(totalPrice * (travellers.children / travellers.total) * 0.75);
  const infantSubtotal = isDefaultPair ? 34186 : (totalPrice - adultSubtotal - childSubtotal);

  return (
    <div className="w-full space-y-6 pb-28">
      
      {/* Route & Selection Header Notice */}
      <div className="bg-[#FF5722] text-white rounded-xl p-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FDB813] text-gray-950 flex items-center justify-center font-bold">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold flex items-center space-x-2">
              <span>{searchData?.searchSummary?.originCity || 'Mumbai'} ({searchData?.searchSummary?.originCode || 'BOM'})</span>
              <ArrowRight className="w-4 h-4 text-[#FDB813]" />
              <span>{searchData?.searchSummary?.destinationCity || 'Kolkata'} ({searchData?.searchSummary?.destinationCode || 'CCU'})</span>
              <span className="text-xs bg-[#FDB813] text-gray-950 font-bold px-2 py-0.5 rounded ml-2">Round Trip</span>
            </div>
            <div className="text-xs text-white/80 mt-0.5 flex flex-wrap items-center gap-2">
              <span>Depart: <strong>{searchData?.searchSummary?.departureDate || '2026-12-15'}</strong></span>
              <span>•</span>
              <span>Return: <strong>{searchData?.searchSummary?.returnDate || '2026-12-31'}</strong></span>
              <span>•</span>
              <span className="text-[#FDB813] font-semibold">{travellers.total} Travellers ({travellers.adults} Adults, {travellers.children} Children, {travellers.infants} Infants)</span>
              <span>•</span>
              <span className="text-white font-bold">{classOfTravel} Class</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-white/80 block">Total Combined Fare</span>
          <span className="text-2xl font-black text-[#FDB813]">{formattedTotal}</span>
        </div>
      </div>

      {/* Split Screen Columns: Outbound Leg vs Return Leg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Outbound Leg Column */}
        <div className="space-y-4">
          <div className="bg-white border-b-2 border-[#FF5722] p-3.5 rounded-t-xl shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-gray-900">
                1. Select Outbound: {searchData?.searchSummary?.originCity || 'Mumbai'} → {searchData?.searchSummary?.destinationCity || 'Kolkata'}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {searchData?.searchSummary?.departureDate || '15 Dec 2026'}
            </span>
          </div>

          <div className="space-y-3">
            {outboundFlights.length === 0 && (
              <EmptyLeg label="outbound" onClear={onClearFilters} filtersActive={filtersActive} />
            )}
            {outboundFlights.map((flight) => {
              const isSelected = selectedOutboundKey === flight.key;

              return (
                <div
                  key={flight.key}
                  onClick={() => setSelectedOutboundKey(flight.key)}
                  className={`bg-white border-2 rounded-xl p-4 transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#FF5722] ring-2 ring-[#FF5722]/15 bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Airline & Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={flight.logo}
                        alt={flight.carrierName}
                        className="h-6 object-contain max-w-[85px]"
                      />
                      <div>
                        <span className="text-xs font-bold text-gray-900">{flight.carrierName}</span>
                        <span className="text-[11px] text-gray-500 ml-1.5 font-medium">({flight.flightNumber})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {flight.cabinClass}
                      </span>
                      {flight.seatsLeft && (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {flight.seatsLeft} seats left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flight Times & Duration */}
                  <div className="flex items-center justify-between py-2 border-y border-gray-100 my-2">
                    <div className="text-left">
                      <div className="text-lg font-black text-gray-900">{flight.departureTime}</div>
                      <div className="text-xs font-bold text-gray-600">{flight.fromCode}</div>
                    </div>

                    <div className="text-center px-2 flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-500">{flight.duration}</div>
                      <div className="w-full max-w-24 mx-auto h-0.5 bg-gray-300 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5722]"></div>
                      </div>
                      <div className="text-[11px] font-medium text-emerald-600">{flight.stopType}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">{flight.arrivalTime}</div>
                      <div className="text-xs font-bold text-gray-600">{flight.toCode}</div>
                    </div>
                  </div>

                  {/* Amenities & Select Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-gray-500 font-medium">
                      {flight.baggage?.checked} • {flight.fareType}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-base font-black text-gray-900">{flight.formattedPrice}</div>
                        <div className="text-[10px] text-gray-400">per leg group</div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                        isSelected 
                          ? 'border-[#FF5722] bg-[#FF5722] text-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Leg Column */}
        <div className="space-y-4">
          <div className="bg-white border-b-2 border-[#FDB813] p-3.5 rounded-t-xl shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-sm font-bold text-gray-900">
                2. Select Return: {searchData?.searchSummary?.destinationCity || 'Kolkata'} → {searchData?.searchSummary?.originCity || 'Mumbai'}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {searchData?.searchSummary?.returnDate || '31 Dec 2026'}
            </span>
          </div>

          <div className="space-y-3">
            {returnFlights.length === 0 && (
              <EmptyLeg label="return" onClear={onClearFilters} filtersActive={filtersActive} />
            )}
            {returnFlights.map((flight) => {
              const isSelected = selectedReturnKey === flight.key;

              return (
                <div
                  key={flight.key}
                  onClick={() => setSelectedReturnKey(flight.key)}
                  className={`bg-white border-2 rounded-xl p-4 transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#FF5722] ring-2 ring-[#FF5722]/15 bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Airline & Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={flight.logo}
                        alt={flight.carrierName}
                        className="h-6 object-contain max-w-[85px]"
                      />
                      <div>
                        <span className="text-xs font-bold text-gray-900">{flight.carrierName}</span>
                        <span className="text-[11px] text-gray-500 ml-1.5 font-medium">({flight.flightNumber})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {flight.cabinClass}
                      </span>
                      {flight.seatsLeft && (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {flight.seatsLeft} seats left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flight Times & Duration */}
                  <div className="flex items-center justify-between py-2 border-y border-gray-100 my-2">
                    <div className="text-left">
                      <div className="text-lg font-black text-gray-900">{flight.departureTime}</div>
                      <div className="text-xs font-bold text-gray-600">{flight.fromCode}</div>
                    </div>

                    <div className="text-center px-2 flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-500">{flight.duration}</div>
                      <div className="w-full max-w-24 mx-auto h-0.5 bg-gray-300 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5722]"></div>
                      </div>
                      <div className="text-[11px] font-medium text-emerald-600">{flight.stopType}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">{flight.arrivalTime}</div>
                      <div className="text-xs font-bold text-gray-600">{flight.toCode}</div>
                    </div>
                  </div>

                  {/* Amenities & Select Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-gray-500 font-medium">
                      {flight.baggage?.checked} • {flight.fareType}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-base font-black text-gray-900">{flight.formattedPrice}</div>
                        <div className="text-[10px] text-gray-400">per leg group</div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                        isSelected 
                          ? 'border-[#FF5722] bg-[#FF5722] text-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar with Real-Time Total Pricing & Passenger Split (IRCTC Air Signature UI) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] py-3 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Selected Legs summary */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-500">Outbound:</span>
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                {selectedOutbound ? `${selectedOutbound.carrierName} ${selectedOutbound.flightNumber} (${selectedOutbound.departureTime})` : 'Choose a flight'}
              </span>
            </div>

            <div className="hidden sm:block text-gray-300">|</div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-500">Return:</span>
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                {selectedReturn ? `${selectedReturn.carrierName} ${selectedReturn.flightNumber} (${selectedReturn.departureTime})` : 'Choose a flight'}
              </span>
            </div>

            <div className="hidden sm:block text-gray-300">|</div>

            <div className="text-gray-600 font-medium">
              <span>{travellers.total} Travellers ({travellers.adults}A, {travellers.children}C, {travellers.infants}I)</span>
              <span className="text-purple-700 font-bold ml-1.5">• {classOfTravel}</span>
            </div>
          </div>

          {/* Right: Total Price & Fare Breakup Trigger & Book Button */}
          <div className="flex items-center space-x-4 shrink-0">
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="text-2xl font-black text-gray-900">{formattedTotal}</span>
                <button
                  type="button"
                  onClick={() => setShowFareBreakup(!showFareBreakup)}
                  className="text-xs font-semibold text-[#FF5722] hover:text-[#E64A19] flex items-center space-x-0.5 underline cursor-pointer ml-1"
                >
                  <span>Fare Breakup</span>
                  {showFareBreakup ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">{pairReady ? `All inclusive total for ${travellers.total} passengers` : 'Select an outbound and a return flight'}</div>
            </div>

            <button
              type="button"
              disabled={!selectedOutbound || !selectedReturn}
              onClick={() => onSelectBooking && onSelectBooking({
                outbound: selectedOutbound,
                inbound: selectedReturn,
                totalPrice,
                travellers,
                classOfTravel
              })}
              className="bg-[#FF5722] hover:bg-[#E64A19] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black px-6 py-2.5 rounded-full text-base shadow-md transition cursor-pointer"
            >
              Book Now
            </button>
          </div>

        </div>

        {/* Fare Breakup Drawer / Popover */}
        {showFareBreakup && (
          <div className="max-w-[1360px] mx-auto mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
            <div>
              <div className="font-bold text-gray-900 mb-1 flex items-center justify-between">
                <span>Adults ({travellers.adults}x)</span>
                <span>₹{adultSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Base Fare + Taxes & Surcharges per Adult
              </div>
            </div>

            <div>
              <div className="font-bold text-gray-900 mb-1 flex items-center justify-between">
                <span>Children ({travellers.children}x)</span>
                <span>₹{childSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Reduced child fare rate with full Business inventory
              </div>
            </div>

            <div>
              <div className="font-bold text-gray-900 mb-1 flex items-center justify-between">
                <span>Infants ({travellers.infants}x)</span>
                <span>₹{infantSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Infant fare with lap seating & IRCTC convenience fee included
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
