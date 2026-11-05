import { AIRPORTS, FREQUENT_AIRPORTS } from '../data/airports';
import { localLowFares, localSearch } from '../data/localFlights';

export async function fetchAirports(query = '') {
  try {
    const res = await fetch(`/api/air/airports?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, using local airport database fallback:', err);
  }

  // Fallback to local dataset
  if (!query || !query.trim()) {
    return FREQUENT_AIRPORTS;
  }
  const q = query.trim().toLowerCase();
  const matches = AIRPORTS.filter(item => {
    return (
      item.code.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    );
  });

  return matches.slice(0, 20);
}

export async function fetchFrequentAirports() {
  try {
    const res = await fetch('/api/air/airports/frequent');
    if (res.ok) {
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch frequent airports from API, using local:', err);
  }
  return FREQUENT_AIRPORTS;
}

export async function fetchLowFares(origin, destination, searchDate) {
  if (!origin || !destination || !searchDate) return [];
  try {
    const params = new URLSearchParams({
      org: origin,
      dest: destination,
      searchDate
    });
    const res = await fetch(`/api/air/lowfare-advance?${params.toString()}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
    }
  } catch (err) {
    console.warn('Low fare strip API error:', err);
  }
  return localLowFares(origin, destination, searchDate);
}

export async function searchFlights(searchParams) {
  try {
    const res = await fetch('/api/air/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchParams)
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) return data.data;
    }
  } catch (err) {
    console.warn('Search flight API error:', err);
  }
  return localSearch(searchParams);
}

export async function fetchAirPrice(flightKey) {
  try {
    const res = await fetch('/api/air/airprice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flightKey })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Airprice API error:', err);
  }
  return null;
}

export async function bookFlight(bookingPayload) {
  try {
    const res = await fetch('/api/air/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Booking API error:', err);
  }
  return null;
}
