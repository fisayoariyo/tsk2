import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toIsoDate } from '../utils/flightResults';

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export default function DateFareStrip({ fares = [], selectedDate, onSelectDate }) {
  const scroller = useRef(null);
  const selectedIso = toIsoDate(selectedDate);

  useEffect(() => {
    const parent = scroller.current;
    const selected = parent?.querySelector('[aria-selected="true"]');
    if (!parent || !selected) return;
    const parentRect = parent.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();
    const delta = (selectedRect.left + selectedRect.width / 2) - (parentRect.left + parentRect.width / 2);
    parent.scrollBy({ left: delta, behavior: 'smooth' });
  }, [fares, selectedIso]);

  if (!fares.length) return null;

  const scrollBy = (direction) => {
    scroller.current?.scrollBy({ left: direction * 220, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center gap-2">
        <button
          type="button"
          aria-label="Earlier dates"
          onClick={() => scrollBy(-1)}
          className="w-11 h-11 shrink-0 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scroller}
          className="flex-1 flex gap-2 overflow-x-auto scrollbar-none scroll-smooth"
          role="listbox"
          aria-label="Lowest fare by date"
        >
          {fares.map((fare) => {
            const selected = fare.date === selectedIso;
            const [weekday, rest] = String(fare.dateString || '').split(', ');
            const [day, month] = (rest || '').split(' ');
            return (
              <button
                key={fare.date}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onSelectDate(fare.date)}
                className={`shrink-0 min-w-[92px] min-h-11 rounded-lg border px-3 py-2 text-center transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] ${
                  selected
                    ? 'border-[#FF5722] bg-[#FFF3EC]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-[11px] font-semibold text-gray-500">{weekday}</div>
                <div className="text-sm font-black text-gray-900 leading-tight">{day} {month}</div>
                <div className={`text-xs font-bold mt-0.5 ${fare.isLowFareAvailable ? 'text-emerald-600' : 'text-gray-700'}`}>
                  {formatPrice(fare.price)}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Later dates"
          onClick={() => scrollBy(1)}
          className="w-11 h-11 shrink-0 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
