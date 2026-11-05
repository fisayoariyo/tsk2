import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import PreviewPage from './pages/PreviewPage';
import { searchFlights, fetchLowFares } from './services/airApi';
import {
  EMPTY_FILTERS,
  DEFAULT_SORT,
  airportCode,
  cityFromLabel,
  buildSearchUrl,
  queryFromLocation,
  toIsoDate,
  toDisplayDate,
  filterFlights,
  sortFlights,
  toggleSort,
  priceBounds,
  filtersAreActive
} from './utils/flightResults';

// ── Routing helpers ──────────────────────────────────────────────────────────
function pageFromPath(pathname = window.location.pathname) {
  const p = pathname.replace(/\/+$/, '');
  if (p.endsWith('/search')) return 'search';
  if (p.endsWith('/booking')) return 'booking';
  if (p.endsWith('/preview')) return 'preview';
  if (p.endsWith('/confirmed')) return 'confirmed';
  return 'home';
}

// ── Initial bookingForm state ─────────────────────────────────────────────────
const INITIAL_BOOKING_FORM = {
  traveller: { title: 'Mr.', firstName: '', lastName: '', email: '', phone: '' },
  contact: {
    firstName: '', lastName: '', email: '', address: '',
    country: 'India', state: '', city: '', pincode: '',
    countryCode: '+91', phone: ''
  },
  gst: { gstin: '', companyName: '', companyEmail: '', companyPin: '' },
  insurance: true,
  selectedSeat1: null,
  selectedSeat2: null,
  selectedMeal: null,
  selectedBaggage: null
};

export default function App() {
  // ── Page / step state ───────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(() => pageFromPath());
  const [currentTab, setCurrentTab] = useState('Flights');

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState({
    from: 'Mumbai (BOM)',
    to: 'Kolkata (CCU)',
    departDate: '15/12/2026',
    returnDate: '31/12/2026',
    tripType: 'R',
    travellers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'Economy',
    specialFares: { defence: false, ltc: false, seniorCitizen: false, student: false }
  });

  const [searchData, setSearchData] = useState(null);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [flights, setFlights] = useState([]);
  const [fareStrip, setFareStrip] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRequest = React.useRef(0);

  // ── Booking flow state ──────────────────────────────────────────────────────
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);

  // ── History sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!window.history.state?.page) {
      const here = `${window.location.pathname}${window.location.search}` || '/';
      window.history.replaceState({ page: pageFromPath() }, '', here);
    }
  }, []);

  const runSearch = useCallback(async (query) => {
    const id = searchRequest.current + 1;
    searchRequest.current = id;
    setSearching(true);
    try {
      const origin = airportCode(query.from);
      const destination = airportCode(query.to);
      const departIso = toIsoDate(query.departDate);
      const [apiResult, strip] = await Promise.all([
        searchFlights({
          origin: query.from,
          destination: query.to,
          originCity: cityFromLabel(query.from),
          destinationCity: cityFromLabel(query.to),
          departureDate: departIso || query.departDate,
          returnDate: query.tripType === 'R' ? (toIsoDate(query.returnDate) || query.returnDate) : '',
          tripType: query.tripType,
          noOfAdults: query.travellers?.adults || 1,
          noOfChildren: query.travellers?.children || 0,
          noOfInfants: query.travellers?.infants || 0,
          classOfTravel: query.cabinClass || 'Economy'
        }),
        query.tripType === 'R' ? Promise.resolve([]) : fetchLowFares(origin, destination, departIso)
      ]);
      if (id !== searchRequest.current) return;
      if (apiResult) {
        setSearchData(apiResult);
        setFlights(apiResult.flights || apiResult.outboundFlights || []);
      }
      setFareStrip(Array.isArray(strip) ? strip : []);
    } finally {
      if (id === searchRequest.current) setSearching(false);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const page = pageFromPath();
      setCurrentPage(page);
      if (page === 'search') {
        const fromUrl = queryFromLocation();
        if (fromUrl) {
          setSearchQuery(fromUrl);
          setFilters(EMPTY_FILTERS);
          runSearch(fromUrl);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [runSearch]);

  // Restore a shared results URL, or load the default search when /search is opened directly.
  useEffect(() => {
    if (pageFromPath() !== 'search') return;
    const fromUrl = queryFromLocation();
    if (fromUrl) setSearchQuery(fromUrl);
    runSearch(fromUrl || {
      from: 'Mumbai (BOM)',
      to: 'Kolkata (CCU)',
      departDate: '15/12/2026',
      returnDate: '31/12/2026',
      tripType: 'R',
      travellers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'Economy'
    });
  }, [runSearch]);

  // ── Navigation helpers ───────────────────────────────────────────────────────
  const navigate = useCallback((page, url) => {
    setCurrentPage(page);
    window.history.pushState({ page }, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback((replace = false) => {
    setCurrentPage('home');
    setCurrentTab('Flights');
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({ page: 'home' }, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goSearch = useCallback((url = '/search') => navigate('search', url), [navigate]);

  const goBooking = useCallback((flight) => {
    if (flight) setSelectedFlight(flight);
    // Reset booking form for new flight selection
    setBookingForm(INITIAL_BOOKING_FORM);
    navigate('booking', '/booking');
  }, [navigate]);

  const goPreview = useCallback(() => navigate('preview', '/preview'), [navigate]);

  const goConfirmed = useCallback((bookingResult) => {
    navigate('confirmed', '/confirmed');
  }, [navigate]);

  const bounds = React.useMemo(() => priceBounds(flights), [flights]);
  const filtersActive = filtersAreActive(filters, bounds);
  const filteredFlights = React.useMemo(
    () => sortFlights(filterFlights(flights, filters), sortBy),
    [flights, filters, sortBy]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleStartSearch = async (params) => {
    const updatedQuery = {
      ...searchQuery,
      ...params,
      from: params?.from || searchQuery.from,
      to: params?.to || searchQuery.to,
    };
    setSearchQuery(updatedQuery);
    setFilters(EMPTY_FILTERS);
    setSortBy(DEFAULT_SORT);
    await runSearch(updatedQuery);
    goSearch(buildSearchUrl(updatedQuery));
  };

  const handleSelectDate = async (isoDate) => {
    const updatedQuery = { ...searchQuery, departDate: toDisplayDate(isoDate), tripType: 'O' };
    setSearchQuery(updatedQuery);
    setFilters(EMPTY_FILTERS);
    setSortBy(DEFAULT_SORT);
    await runSearch(updatedQuery);
    window.history.pushState({ page: 'search' }, '', buildSearchUrl(updatedQuery));
  };

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  const handleSelectPopularRoute = (route) => {
    handleStartSearch({
      from: 'Mumbai (BOM)',
      to: `${route.to} (${route.code})`,
      tripType: 'O',
      travellers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'Economy'
    });
  };

  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    if (tab === 'Flights' && currentPage !== 'home') goHome();
  };

  // ── Confirmation page ────────────────────────────────────────────────────────
  if (currentPage === 'confirmed') {
    const pnr = 'FH' + Math.random().toString(36).slice(2, 8).toUpperCase();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm">Your flight has been successfully booked.</p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Your PNR / Booking Reference</div>
            <div className="text-2xl font-black text-[#FF5722] tracking-widest">{pnr}</div>
          </div>
          <p className="text-xs text-gray-400">
            A confirmation has been sent to {bookingForm.traveller.email || bookingForm.contact.email || 'your email'}.
          </p>
          <button
            onClick={() => { goHome(); setSelectedFlight(null); setBookingForm(INITIAL_BOOKING_FORM); }}
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer"
          >
            Book Another Flight
          </button>
        </div>
      </div>
    );
  }

  // ── Booking Details page (Step 1) ────────────────────────────────────────────
  if (currentPage === 'booking') {
    return (
      <BookingDetailsPage
        flight={selectedFlight}
        searchQuery={searchQuery}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        onContinueToPreview={goPreview}
        onNavigateBack={goSearch}
      />
    );
  }

  // ── Preview page (Step 2) ────────────────────────────────────────────────────
  if (currentPage === 'preview') {
    return (
      <PreviewPage
        flight={selectedFlight}
        searchQuery={searchQuery}
        bookingForm={bookingForm}
        onBackToBooking={() => navigate('booking', '/booking')}
        onConfirmPayment={goConfirmed}
      />
    );
  }

  // ── Home + Search pages (wrap with shared Header/Footer) ─────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onNavigateHome={() => goHome()}
      />

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
            searchData={searchData}
            flights={filteredFlights}
            allFlights={flights}
            sortBy={sortBy}
            onSortChange={(key) => setSortBy((current) => toggleSort(current, key))}
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
            filtersActive={filtersActive}
            fareStrip={fareStrip}
            onSelectDate={handleSelectDate}
            searching={searching}
            onSearch={handleStartSearch}
            onSelectFlight={(flight) => goBooking(flight)}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
