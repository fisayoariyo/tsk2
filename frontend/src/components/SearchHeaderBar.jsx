import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchHeaderBar({
  searchSummary = {
    origin: 'London (Any)',
    destination: 'Mumbai (BOM)',
    passengers: '1 Adult, Economy',
    departDate: 'Mon, 9 Nov',
    returnDate: 'Mon, 16 Nov'
  },
  onModifySearch
}) {
  return (
    <div className="w-full bg-[#FF5722] py-3.5 px-6 sm:px-10 lg:px-12 shadow-sm">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Search Summary — lightly rounded, not pill */}
        <div 
          onClick={onModifySearch}
          className="w-full md:w-auto flex-1 max-w-2xl bg-white rounded-lg p-1.5 pr-5 flex items-center space-x-3.5 cursor-pointer shadow-sm hover:shadow transition"
        >
          <div className="w-9 h-9 rounded-md bg-[#FF5722] text-white flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0 text-sm font-bold text-gray-900 truncate">
            <span>{searchSummary.origin}</span>
            <span className="text-gray-400 font-normal mx-2">—</span>
            <span>{searchSummary.destination}</span>
            <span className="text-gray-300 mx-3 font-normal">|</span>
            <span className="text-gray-700 font-semibold">{searchSummary.passengers}</span>
          </div>
        </div>

        {/* Right: Date navigation selectors */}
        <div className="flex items-center space-x-4 sm:space-x-6 shrink-0 text-white font-bold text-sm">
          
          {/* Depart Date Navigator */}
          <div className="flex items-center space-x-2.5">
            <button className="w-7 h-7 rounded-lg bg-[#FFE6D9] hover:bg-white text-orange-600 flex items-center justify-center transition shadow-xs">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="tracking-tight select-none min-w-[85px] text-center">
              {searchSummary.departDate}
            </span>
            <button className="w-7 h-7 rounded-lg bg-[#FFE6D9] hover:bg-white text-orange-600 flex items-center justify-center transition shadow-xs">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-5 w-[1.5px] bg-white/40"></div>

          {/* Return Date Navigator */}
          <div className="flex items-center space-x-2.5">
            <button className="w-7 h-7 rounded-lg bg-[#FFE6D9] hover:bg-white text-orange-600 flex items-center justify-center transition shadow-xs">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="tracking-tight select-none min-w-[90px] text-center">
              {searchSummary.returnDate}
            </span>
            <button className="w-7 h-7 rounded-lg bg-[#FFE6D9] hover:bg-white text-orange-600 flex items-center justify-center transition shadow-xs">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
