import React from 'react';
import { ArrowRight, Plane } from 'lucide-react';

export default function MumbaiPromoCard({ city = 'Mumbai', onExplore, className = '' }) {
  return (
    <aside className={`w-full lg:w-[280px] shrink-0 ${className}`}>
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs relative flex flex-col group hover:shadow-md transition-all">
        
        {/* Top Content */}
        <div className="p-5 pb-3">
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">
            Feel at home<br />in {city}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium leading-relaxed">
            Find the best flights and plan your stay in the city of dreams.
          </p>
        </div>

        {/* Scenic city image — cropped toward Taj Mahal Palace */}
        <div className="h-48 sm:h-56 w-full overflow-hidden relative bg-[#F4E8D8]">
          <img
            src="/mumbai-promo.jpg"
            alt="Taj Mahal Palace and Gateway of India, Mumbai at sunset"
            className="w-full h-full object-cover object-[58%_42%] scale-110 group-hover:scale-[1.15] transition-transform duration-500"
          />
        </div>

        {/* Bottom Orange Brand Bar */}
        <div className="bg-[#FF5722] p-3.5 px-5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 fill-current stroke-[2.5]" />
            <span className="font-extrabold text-base tracking-tight">Flyhigh</span>
          </div>

          <button
            onClick={onExplore}
            className="w-8 h-8 rounded-full bg-white text-[#FF5722] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xs"
            title="Explore Mumbai"
          >
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </aside>
  );
}
