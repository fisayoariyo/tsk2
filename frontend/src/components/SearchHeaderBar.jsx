import React from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function SearchHeaderBar({
  searchSummary = {
    origin: 'Mumbai (BOM)',
    destination: 'Kolkata (CCU)',
    passengers: '8 Travellers, Business',
    departDate: '15/12/2026',
    returnDate: '31/12/2026',
    tripType: 'R'
  },
  onModifySearch
}) {
  return (
    <div className="w-full bg-[#FF5722] py-3 px-4 sm:px-8 shadow-md">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Search Summary Bar */}
        <button
          type="button"
          onClick={onModifySearch}
          className="w-full md:w-auto flex-1 max-w-2xl bg-white rounded-lg p-2 pr-5 flex items-center space-x-3.5 cursor-pointer shadow-xs hover:shadow transition text-left"
          title="Change this search"
        >
          <div className="w-8 h-8 rounded bg-[#FDB813] text-gray-950 flex items-center justify-center shrink-0 font-bold">
            <Search className="w-4 h-4 stroke-[2.75]" />
          </div>
          <div className="flex-1 min-w-0 text-sm font-bold text-gray-900 truncate">
            <span className="text-gray-900">{searchSummary.origin}</span>
            <span className="text-gray-400 font-normal mx-2">⇄</span>
            <span className="text-gray-900">{searchSummary.destination}</span>
            <span className="text-gray-300 mx-3 font-normal">|</span>
            <span className="text-gray-700 font-semibold">{searchSummary.passengers}</span>
          </div>
          <span className="text-xs font-bold text-[#FF5722] shrink-0">Modify</span>
        </button>

        {/* Right: Date navigation selectors */}
        <div className="flex items-center space-x-4 sm:space-x-6 shrink-0 text-white font-bold text-sm">
          
          {/* Depart Date Navigator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/70 font-normal">Depart:</span>
            <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-[#FDB813]" />
              <span className="tracking-tight select-none">
                {searchSummary.departDate}
              </span>
            </div>
          </div>

          {/* Return Date Navigator (if round trip) */}
          {searchSummary.returnDate && (
            <>
              <div className="h-4 w-[1px] bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/70 font-normal">Return:</span>
                <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-[#FDB813]" />
                  <span className="tracking-tight select-none">
                    {searchSummary.returnDate}
                  </span>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
