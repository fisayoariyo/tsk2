import React, { useState } from 'react';
import SearchHeaderBar from '../components/SearchHeaderBar';
import SearchFiltersSidebar from '../components/SearchFiltersSidebar';
import MobileFilters from '../components/MobileFilters';
import FlightResultsList from '../components/FlightResultsList';
import RoundTripSplitResults from '../components/RoundTripSplitResults';
import MumbaiPromoCard from '../components/MumbaiPromoCard';
import DateFareStrip from '../components/DateFareStrip';
import HeroSection from '../components/HeroSection';
import { filterFlights, priceBounds } from '../utils/flightResults';

function activeFilterCount(filters, bounds) {
  if (!filters) return 0;
  let count = (filters.departSlots?.length || 0)
    + (filters.arriveSlots?.length || 0)
    + (filters.stops?.length || 0)
    + (filters.airlines?.length || 0);
  if (filters.priceMin != null && bounds && filters.priceMin > bounds.min) count += 1;
  if (filters.priceMax != null && bounds && filters.priceMax < bounds.max) count += 1;
  return count;
}

export default function SearchPage({
  searchQuery,
  searchData,
  flights,
  allFlights = [],
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onClearFilters,
  filtersActive = false,
  fareStrip = [],
  onSelectDate,
  searching = false,
  onSearch,
  onSelectFlight
}) {
  const isRoundTripSplit = searchData?.isSplitView || searchQuery?.tripType === 'R';

  const travellersCount = (searchQuery?.travellers?.adults || 1)
    + (searchQuery?.travellers?.children || 0)
    + (searchQuery?.travellers?.infants || 0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [editingSearch, setEditingSearch] = useState(false);
  const filterPool = isRoundTripSplit
    ? [...(searchData?.outboundFlights || []), ...(searchData?.returnFlights || [])]
    : allFlights;
  const filterCount = activeFilterCount(filters, priceBounds(filterPool));
  const searchKey = [
    searchQuery?.from,
    searchQuery?.to,
    searchQuery?.departDate,
    searchQuery?.returnDate,
    searchQuery?.tripType,
    searchQuery?.cabinClass,
    travellersCount
  ].join('|');

  const summary = {
    origin: searchQuery?.from || 'Mumbai (BOM)',
    destination: searchQuery?.to || 'Kolkata (CCU)',
    passengers: `${travellersCount} Travellers, ${searchQuery?.cabinClass || 'Economy'}`,
    departDate: searchQuery?.departDate || '15/12/2026',
    returnDate: searchQuery?.returnDate || (isRoundTripSplit ? '31/12/2026' : ''),
    tripType: searchQuery?.tripType || 'R'
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">

      <div className="hidden md:block sticky top-16 z-40">
        <HeroSection
          key={searchKey}
          variant="bar"
          initialQuery={searchQuery}
          onSearch={onSearch}
        />
      </div>

      <div className="md:hidden">
        <SearchHeaderBar
          searchSummary={summary}
          onModifySearch={() => setEditingSearch((open) => !open)}
        />
        {editingSearch && (
          <HeroSection
            key={`edit-${searchKey}`}
            variant="panel"
            initialQuery={searchQuery}
            onCancel={() => setEditingSearch(false)}
            onSearch={(params) => {
              setEditingSearch(false);
              if (onSearch) onSearch(params);
            }}
          />
        )}
      </div>

      {!isRoundTripSplit && (
        <DateFareStrip
          fares={fareStrip}
          selectedDate={searchQuery?.departDate}
          onSelectDate={onSelectDate}
        />
      )}

      {/* Main Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-7 pb-28 lg:pb-7">

        {isRoundTripSplit ? (
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px] gap-6 items-start">
            <div className="hidden md:block shrink-0">
              <SearchFiltersSidebar
                flights={filterPool}
                filters={filters}
                onFilterChange={onFilterChange}
                onClear={onClearFilters}
              />
            </div>
            <div className="min-w-0">
              <RoundTripSplitResults
                searchData={searchData}
                outboundFlights={filterFlights(searchData?.outboundFlights || [], filters)}
                returnFlights={filterFlights(searchData?.returnFlights || [], filters)}
                filtersActive={filtersActive}
                onClearFilters={onClearFilters}
                onSelectBooking={(bookingData) => {
                  if (onSelectFlight) onSelectFlight(bookingData);
                }}
              />
            </div>
            <MumbaiPromoCard
              className="lg:col-start-2 lg:justify-self-end xl:col-start-auto xl:justify-self-stretch"
              city={searchQuery?.to?.includes('Mumbai') || !searchQuery?.to ? 'Mumbai' : searchQuery.to}
              onExplore={() => alert(`Exploring best deals in ${searchQuery?.to || 'Mumbai'}!`)}
            />
          </div>
        ) : (
          /* Standard One-Way list */
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Filters Sidebar */}
            <div className="hidden md:block shrink-0">
              <SearchFiltersSidebar
                flights={filterPool}
                filters={filters}
                onFilterChange={onFilterChange}
                onClear={onClearFilters}
              />
            </div>

            {/* Flight Cards */}
            <FlightResultsList
              flights={flights}
              totalCount={allFlights.length}
              sortBy={sortBy}
              onSortChange={onSortChange}
              onClearFilters={onClearFilters}
              filtersActive={filtersActive}
              searching={searching}
              onSelectFlight={(flight) => {
                if (onSelectFlight) onSelectFlight(flight);
              }}
            />

            {/* Destination Promo */}
            <MumbaiPromoCard
              city={searchQuery?.to?.includes('Mumbai') || !searchQuery?.to ? 'Mumbai' : searchQuery.to}
              onExplore={() => alert(`Exploring best deals in ${searchQuery?.to || 'Mumbai'}!`)}
            />
          </div>
        )}

        <MobileFilters
          open={filtersOpen}
          onToggle={() => setFiltersOpen((open) => !open)}
          count={filterCount}
          raised={isRoundTripSplit}
          flights={filterPool}
          filters={filters}
          onFilterChange={onFilterChange}
          onClear={onClearFilters}
        />

      </main>
    </div>
  );
}
