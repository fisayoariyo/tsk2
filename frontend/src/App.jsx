import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import { INITIAL_FLIGHTS } from './data/mockFlights';

function pageFromPath(pathname = window.location.pathname) {
  return pathname.replace(/\/+$/, '').endsWith('/search') ? 'search' : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromPath());
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

  const [flights] = useState(INITIAL_FLIGHTS);

  // Keep React page state in sync with browser history (Back/Forward)
  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: pageFromPath() }, '', window.location.pathname || '/');
    }

    const onPopState = (event) => {
      const page = event.state?.page || pageFromPath();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const goHome = useCallback((replace = false) => {
    setCurrentPage('home');
    setCurrentTab('Flights');
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({ page: 'home' }, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goSearch = useCallback(() => {
    setCurrentPage('search');
    window.history.pushState({ page: 'search' }, '', '/search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    goSearch();
  };

  const handleSelectPopularRoute = (route) => {
    setSearchQuery(prev => ({
      ...prev,
      from: 'United Kingdom (UK)',
      to: `${route.to} (${route.code})`
    }));
    goSearch();
  };

  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    if (tab === 'Flights' && currentPage !== 'home') {
      goHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onNavigateHome={() => goHome()}
      />

      {/* Main Page View */}
      <div className="flex-1">
        {currentPage === 'home' ? (
          <HomePage
            onSearch={handleStartSearch}
            onSelectPopularRoute={handleSelectPopularRoute}
            onNavigateHome={() => goHome()}
          />
        ) : (
          <SearchPage
            searchQuery={searchQuery}
            flights={filteredFlights}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={setFilters}
            onModifySearch={() => goHome()}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
