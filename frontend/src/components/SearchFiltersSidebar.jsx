import React from 'react';
import { Moon, Sunrise, Sun, Sunset } from 'lucide-react';
import { airlineOptions, filtersAreActive, priceBounds } from '../utils/flightResults';

const TIME_SLOTS = [
  { id: 'night', label: '00:00 to 06:00', Icon: Moon },
  { id: 'morning', label: '06:00 to 12:00', Icon: Sunrise },
  { id: 'afternoon', label: '12:00 to 18:00', Icon: Sun },
  { id: 'evening', label: '18:00 to 24:00', Icon: Sunset }
];

function formatRupees(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

function toggleValue(list, value) {
  const current = list || [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function TimeSlots({ legend, selected, onToggle }) {
  return (
    <fieldset className="mt-3">
      <legend className="text-xs font-bold text-gray-800 mb-2">{legend}</legend>
      <div className="grid grid-cols-4 gap-1.5">
        {TIME_SLOTS.map((slot) => {
          const active = selected.includes(slot.id);
          const Icon = slot.Icon;
          return (
            <button
              key={slot.id}
              type="button"
              aria-pressed={active}
              aria-label={`${legend} ${slot.label}`}
              onClick={() => onToggle(slot.id)}
              className={`min-h-11 rounded-lg border px-0.5 py-1.5 flex flex-col items-center justify-center gap-1 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] ${
                active
                  ? 'border-[#FF5722] bg-[#FFF3EC] text-[#FF5722]'
                  : 'border-gray-200 bg-white text-[#5B6B8C] hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="text-[10px] leading-tight text-center font-medium">{slot.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PriceRange({ min, max, valueMin, valueMax, onChange }) {
  const lo = valueMin ?? min;
  const hi = valueMax ?? max;
  const span = Math.max(max - min, 1);
  const left = ((lo - min) / span) * 100;
  const right = ((hi - min) / span) * 100;

  const setLo = (next) => onChange(Math.min(Number(next), hi), hi);
  const setHi = (next) => onChange(lo, Math.max(Number(next), lo));

  return (
    <div className="mt-3">
      <div className="dual-range">
        <div className="dual-range-track" aria-hidden="true">
          <div className="dual-range-fill" style={{ left: `${left}%`, width: `${Math.max(right - left, 0)}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={lo}
          aria-label="Minimum price"
          onChange={(event) => setLo(event.target.value)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={hi}
          aria-label="Maximum price"
          onChange={(event) => setHi(event.target.value)}
        />
      </div>
      <div className="flex items-start justify-between mt-2 text-xs">
        <div>
          <div className="text-gray-500 font-medium">Min. Price</div>
          <div className="font-bold text-gray-900 mt-0.5">{formatRupees(lo)}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 font-medium">Max. Price</div>
          <div className="font-bold text-gray-900 mt-0.5">{formatRupees(hi)}</div>
        </div>
      </div>
    </div>
  );
}

export default function SearchFiltersSidebar({ flights = [], filters, onFilterChange, onClear, embedded = false }) {
  const bounds = priceBounds(flights);
  const airlines = airlineOptions(flights);
  const active = filtersAreActive(filters, bounds);
  const singlePrice = bounds.min === bounds.max;

  const update = (patch) => onFilterChange({ ...filters, ...patch });

  return (
    <aside className={embedded ? 'w-full' : 'w-full lg:w-[240px] shrink-0'} aria-label="Filter flights">
      <div className={embedded ? 'p-4 pb-8' : 'bg-white border border-gray-200 rounded-xl shadow-xs p-4'}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-extrabold text-[#0F172A] text-base">Price</h2>
          {active && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-bold text-[#FF5722] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded"
            >
              Clear all
            </button>
          )}
        </div>

        {flights.length === 0 ? (
          <p className="text-sm text-gray-500 mt-3">Filters appear once flights are loaded.</p>
        ) : singlePrice ? (
          <p className="text-sm font-bold text-gray-900 mt-3">{formatRupees(bounds.min)}</p>
        ) : (
          <PriceRange
            min={bounds.min}
            max={bounds.max}
            valueMin={filters.priceMin}
            valueMax={filters.priceMax}
            onChange={(priceMin, priceMax) => update({ priceMin, priceMax })}
          />
        )}

        <div className="mt-5 pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-[#0F172A] text-base">Time Preference</h2>
          <TimeSlots
            legend="Departure"
            selected={filters.departSlots || []}
            onToggle={(id) => update({ departSlots: toggleValue(filters.departSlots, id) })}
          />
          <TimeSlots
            legend="Arrival"
            selected={filters.arriveSlots || []}
            onToggle={(id) => update({ arriveSlots: toggleValue(filters.arriveSlots, id) })}
          />
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-[#0F172A] text-base">Stops</h2>
          <div className="mt-3 flex items-center gap-4">
            {[0, 1, 2].map((stop) => (
              <label key={stop} className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.stops || []).includes(stop)}
                  onChange={() => update({ stops: toggleValue(filters.stops, stop) })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>{stop}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-[#0F172A] text-base">Airlines</h2>
          {airlines.length === 0 ? (
            <p className="text-sm text-gray-500 mt-3">No airlines in this result.</p>
          ) : (
            <div className="mt-2 space-y-1">
              {airlines.map((airline) => (
                <label key={airline.code} className="flex items-center gap-2.5 text-sm cursor-pointer min-h-11">
                  <input
                    type="checkbox"
                    checked={(filters.airlines || []).includes(airline.code)}
                    onChange={() => update({ airlines: toggleValue(filters.airlines, airline.code) })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  {airline.logo ? (
                    <img src={airline.logo} alt="" className="h-4 w-auto max-w-[72px] object-contain object-left" />
                  ) : (
                    <span aria-hidden="true" className="w-4 h-4 rounded-sm bg-[#FF5722] text-white text-[8px] font-black flex items-center justify-center">
                      {airline.code.slice(0, 1)}
                    </span>
                  )}
                  <span className="font-medium text-gray-800">{airline.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
