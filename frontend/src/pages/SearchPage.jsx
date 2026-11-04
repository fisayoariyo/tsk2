import React, { useState } from 'react';
import SearchHeaderBar from '../components/SearchHeaderBar';
import SearchFiltersSidebar from '../components/SearchFiltersSidebar';
import FlightResultsList from '../components/FlightResultsList';
import MumbaiPromoCard from '../components/MumbaiPromoCard';
import BookingModal from '../components/BookingModal';

export default function SearchPage({
  searchQuery,
  flights,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onModifySearch
}) {
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      
      {/* Sticky Orange Search Summary Bar */}
      <SearchHeaderBar
        searchSummary={{
          origin: searchQuery?.from || 'London (Any)',
          destination: searchQuery?.to || 'Mumbai (BOM)',
          passengers: `${searchQuery?.travellers?.adults || 1} Adult, ${searchQuery?.cabinClass || 'Economy'}`,
          departDate: 'Mon, 9 Nov',
          returnDate: 'Mon, 16 Nov'
        }}
        onModifySearch={onModifySearch}
      />

      {/* Main 3-Column Search Content Container */}
      <main className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-7">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Sidebar: Filters */}
          <SearchFiltersSidebar
            filters={filters}
            onFilterChange={onFilterChange}
          />

          {/* Center Column: Sort Tabs & Flight Cards */}
          <FlightResultsList
            flights={flights}
            sortBy={sortBy}
            onSortChange={onSortChange}
            onSelectFlight={(flight) => setSelectedFlightForBooking(flight)}
          />

          {/* Right Column: Destination Promo Card */}
          <MumbaiPromoCard
            city={searchQuery?.to?.includes('Mumbai') || !searchQuery?.to ? 'Mumbai' : searchQuery.to}
            onExplore={() => alert(`Exploring best deals in ${searchQuery?.to || 'Mumbai'}!`)}
          />

        </div>
      </main>

      {/* Booking Drawer / Modal */}
      {selectedFlightForBooking && (
        <BookingModal
          flight={selectedFlightForBooking}
          onClose={() => setSelectedFlightForBooking(null)}
          onBookingComplete={(pnr) => console.log('PNR Created:', pnr)}
        />
      )}

    </div>
  );
}
