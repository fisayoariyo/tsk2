import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import { INITIAL_FLIGHTS } from './data/mockFlights';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'search'
  const [currentTab, setCurrentTab] = useState('Flights');
  const [searchQuery, setSearchQuery] = useState({
    from: 'London (Any)',
    to: 'Mumbai (BOM)',
    departDate: '09/11/2026',
    returnDate: '16/11/2026',
    tripType: 'Return',
    travellers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'Economy',
    directOnly: false
  });

  const [sortBy, setSortBy] = useState('best');
  const [filters, setFilters] = useState({
    stops: ['direct', '1stop'],
    baggage: [],
    maxDuration: 36
  });

  const [flights, setFlights] = useState(INITIAL_FLIGHTS);

  // Filter & Sort logic
  const filteredFlights = React.useMemo(() => {
    let result = [...flights];

    // Stops filter
    if (filters.stops && filters.stops.length > 0) {
      result = result.filter(f => {
        if (filters.stops.includes('direct') && f.stops === 0) return true;
        if (filters.stops.includes('1stop') && f.stops === 1) return true;
        if (filters.stops.includes('2stops') && f.stops >= 2) return true;
        return false;
      });
    }

    // Sort
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => a.stops - b.stops || a.price - b.price);
    } else {
      // Best
      result.sort((a, b) => {
        if (a.isBest && !b.isBest) return -1;
        if (!a.isBest && b.isBest) return 1;
        return a.price - b.price;
      });
    }

    return result;
  }, [flights, filters, sortBy]);

  const handleStartSearch = (params) => {
    setSearchQuery({
      ...searchQuery,
      ...params,
      origin: params?.from || 'London (Any)',
      destination: params?.to || 'Mumbai (BOM)'
    });
    setCurrentPage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPopularRoute = (route) => {
    setSearchQuery(prev => ({
      ...prev,
      from: 'United Kingdom (UK)',
      to: `${route.to} (${route.code})`
    }));
    setCurrentPage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Page View */}
      <div className="flex-1">
        {currentPage === 'home' ? (
          <HomePage
            onSearch={handleStartSearch}
            onSelectPopularRoute={handleSelectPopularRoute}
          />
        ) : (
          <SearchPage
            searchQuery={searchQuery}
            flights={filteredFlights}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={setFilters}
            onModifySearch={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
