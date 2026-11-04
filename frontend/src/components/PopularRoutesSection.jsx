import React from 'react';

export default function PopularRoutesSection({ onSelectRoute }) {
  const routes = [
    {
      id: 'dubai',
      from: 'UK',
      to: 'Dubai',
      code: 'DXB',
      price: '£289',
      image: '/destinations/dubai.png'
    },
    {
      id: 'new-york',
      from: 'UK',
      to: 'New York',
      code: 'JFK',
      price: '£399',
      image: '/destinations/new-york.png'
    },
    {
      id: 'delhi',
      from: 'UK',
      to: 'Delhi',
      code: 'DEL',
      price: '£449',
      image: '/destinations/delhi.png'
    },
    {
      id: 'mumbai',
      from: 'UK',
      to: 'Mumbai',
      code: 'BOM',
      price: '£479',
      image: '/destinations/mumbai.png'
    },
    {
      id: 'bangkok',
      from: 'UK',
      to: 'Bangkok',
      code: 'BKK',
      price: '£459',
      image: '/destinations/bangkok.png'
    },
    {
      id: 'singapore',
      from: 'UK',
      to: 'Singapore',
      code: 'SIN',
      price: '£499',
      image: '/destinations/singapore.png'
    }
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12 py-8">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-6">
        Popular flight routes from United Kingdom
      </h2>

      {/* Grid of 6 destination cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => onSelectRoute && onSelectRoute(route)}
            className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group"
          >
            {/* Destination Image */}
            <div className="h-32 sm:h-36 w-full overflow-hidden bg-gray-100 relative">
              <img
                src={route.image}
                alt={`${route.to} skyline`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content Details */}
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
                {route.from} <span className="text-gray-400 font-normal">→</span> {route.to}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                from <span className="font-extrabold text-[#FF5722] text-sm sm:text-base">{route.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
