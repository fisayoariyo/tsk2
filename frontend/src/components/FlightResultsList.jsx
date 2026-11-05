import React, { useState } from 'react';
import { Heart, Globe, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { sortLabel } from '../utils/flightResults';

const SORTS = [
  { key: 'airline', label: 'Airline' },
  { key: 'departure', label: 'Departure' },
  { key: 'arrival', label: 'Arrival' },
  { key: 'duration', label: 'Duration' },
  { key: 'price', label: 'Price' }
];

function Leg({ leg }) {
  if (!leg) return null;
  return (
    <div className="flex items-center justify-between sm:justify-start sm:space-x-8 text-sm">
      <div className="w-24">
        <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">{leg.departureTime}</div>
        <div className="text-xs font-semibold text-gray-500">{leg.fromCity ? `${leg.fromCity} (${leg.fromCode})` : leg.fromCode}</div>
      </div>
      <div className="flex-1 max-w-[180px] sm:max-w-[220px] text-center">
        <div className="text-xs font-medium text-gray-500">{leg.duration}</div>
        <div className="relative my-1 flex items-center">
          <div className="w-full h-[1.5px] bg-gray-300" />
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 absolute right-0" />
        </div>
        <div className={`text-xs font-bold ${leg.stops === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
          {leg.stopType}
        </div>
      </div>
      <div className="w-28 text-right sm:text-left">
        <div className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
          {leg.arrivalTime}
          {leg.dayOffset && <span className="text-xs font-bold text-gray-700 align-super ml-0.5">{leg.dayOffset}</span>}
        </div>
        <div className="text-xs font-semibold text-gray-500">{leg.toCity ? `${leg.toCity} (${leg.toCode})` : leg.toCode}</div>
      </div>
    </div>
  );
}

export default function FlightResultsList({
  flights = [],
  totalCount = 0,
  sortBy,
  onSortChange,
  onSelectFlight,
  onClearFilters,
  filtersActive = false,
  searching = false
}) {
  const [favorites, setFavorites] = useState({});
  const activeLabel = sortLabel(sortBy);

  const toggleFavorite = (flightKey, event) => {
    event.stopPropagation();
    setFavorites((prev) => ({ ...prev, [flightKey]: !prev[flightKey] }));
  };

  return (
    <div className={`flex-1 min-w-0 space-y-4 ${searching ? 'opacity-60' : ''}`} aria-busy={searching}>
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700 font-medium">
        <div className="flex items-center space-x-1.5" aria-live="polite">
          <span className="font-bold text-gray-900">{flights.length} results</span>
          <span>sorted by:</span>
          <span className="font-bold text-gray-900">{activeLabel}</span>
        </div>
        {totalCount > flights.length && (
          <span className="text-xs text-gray-500">{totalCount} before filters</span>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs flex flex-wrap">
        {SORTS.map((sort) => {
          const active = sortBy?.key === sort.key;
          const Icon = sortBy?.dir === 'desc' ? ChevronDown : ChevronUp;
          return (
            <button
              key={sort.key}
              type="button"
              onClick={() => onSortChange(sort.key)}
              aria-pressed={active}
              className={`flex-1 min-w-[96px] min-h-11 px-3 py-3 text-left text-sm font-bold border-r border-gray-100 last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF5722] ${
                active ? 'text-[#FF5722]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                {sort.label}
                {active && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-[#FF5722] rounded-2xl p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[#FF5722]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">See the world differently</h3>
            <p className="text-xs text-white/85 mt-0.5">More flight options, better fares and flexible travel, only on Flyhigh.</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FDB813] text-gray-950 text-xs font-bold shrink-0">
          <span aria-hidden="true">☆</span>
          <span>Flyhigh Picks</span>
        </div>
      </div>

      {flights.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
          <h3 className="text-base font-bold text-gray-900">No flights match these filters</h3>
          <p className="text-sm text-gray-500 mt-1">Try another time, airline, or stop count.</p>
          {filtersActive && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 min-h-11 px-5 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#E64A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5722]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {flights.map((flight) => {
            const outbound = flight.outbound || flight;
            const oneWay = !flight.inbound;
            return (
              <article
                key={flight.key}
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center space-x-3">
                      {flight.logo ? (
                        <img src={flight.logo} alt="" className="h-6 sm:h-7 object-contain max-w-[100px]" />
                      ) : null}
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 text-sm sm:text-base">{flight.carrierName}</div>
                        {flight.flightNumber && (
                          <div className="text-xs font-semibold text-gray-500">{flight.flightNumber}</div>
                        )}
                      </div>
                    </div>
                    <Leg leg={outbound} />
                    {flight.inbound && (
                      <div className="pt-1 border-t border-gray-100">
                        <Leg leg={flight.inbound} />
                      </div>
                    )}
                  </div>

                  <div className="lg:border-l lg:border-gray-200 lg:pl-5 pt-3 lg:pt-0 flex flex-col gap-3 shrink-0 lg:w-[220px]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 text-left">
                        <div className="text-[11px] text-gray-500 font-medium leading-snug">
                          {oneWay ? (flight.fareCondition || 'Total fare') : 'Return per traveller from'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-[#E64A19] tracking-tight leading-none mt-1">
                          {flight.formattedPrice}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => toggleFavorite(flight.key, event)}
                        aria-label={favorites[flight.key] ? 'Remove from saved flights' : 'Save flight'}
                        aria-pressed={Boolean(favorites[flight.key])}
                        className="shrink-0 -mt-1.5 -mr-1.5 w-11 h-11 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
                      >
                        <Heart className={`w-5 h-5 ${favorites[flight.key] ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectFlight(flight)}
                      className="min-h-11 w-full flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#FF5722] hover:bg-[#E64A19] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5722]"
                    >
                      <span>{oneWay ? 'View prices' : 'Select'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
