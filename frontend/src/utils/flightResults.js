export const EMPTY_FILTERS = {
  priceMin: null,
  priceMax: null,
  departSlots: [],
  arriveSlots: [],
  stops: [],
  airlines: []
};

export const DEFAULT_SORT = { key: 'price', dir: 'asc' };

const SORT_LABELS = {
  price: 'Price',
  departure: 'Departure',
  arrival: 'Arrival',
  duration: 'Duration',
  airline: 'Airline'
};

export function sortLabel(sort) {
  return SORT_LABELS[sort?.key] || 'Price';
}

export function airportCode(label = '') {
  const match = String(label).match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = String(label).trim();
  if (/^[A-Za-z]{3}$/.test(trimmed)) return trimmed.toUpperCase();
  return '';
}

export function cityFromLabel(label = '') {
  return String(label).replace(/\s*\([A-Za-z]{3}\)\s*$/, '').trim();
}

export function toIsoDate(value) {
  if (!value) return '';
  const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = String(value).match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  return '';
}

export function toDisplayDate(value) {
  const iso = toIsoDate(value);
  if (!iso) return value || '';
  const [, year, month, day] = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return `${day}/${month}/${year}`;
}

export function buildSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('type', query.tripType === 'R' ? 'R' : 'O');
  const origin = airportCode(query.from);
  const destination = airportCode(query.to);
  if (origin) params.set('origin', origin);
  if (query.from) params.set('originCity', cityFromLabel(query.from));
  if (destination) params.set('destination', destination);
  if (query.to) params.set('destinationCity', cityFromLabel(query.to));
  const depart = toIsoDate(query.departDate);
  if (depart) params.set('flight_depart_date', depart);
  if (query.tripType === 'R') {
    const ret = toIsoDate(query.returnDate);
    if (ret) params.set('flight_return_date', ret);
  }
  params.set('ADT', String(query.travellers?.adults ?? 1));
  params.set('CHD', String(query.travellers?.children ?? 0));
  params.set('INF', String(query.travellers?.infants ?? 0));
  params.set('class', query.cabinClass || 'Economy');
  return `/search?${params.toString()}`;
}

export function queryFromLocation(search = window.location.search) {
  const params = new URLSearchParams(search);
  if (!params.get('origin') && !params.get('destination')) return null;
  const origin = params.get('origin') || '';
  const destination = params.get('destination') || '';
  const originCity = params.get('originCity') || origin;
  const destinationCity = params.get('destinationCity') || destination;
  return {
    from: origin ? `${originCity} (${origin})` : originCity,
    to: destination ? `${destinationCity} (${destination})` : destinationCity,
    departDate: toDisplayDate(params.get('flight_depart_date') || ''),
    returnDate: toDisplayDate(params.get('flight_return_date') || ''),
    tripType: params.get('type') === 'R' ? 'R' : 'O',
    travellers: {
      adults: Number(params.get('ADT') || 1),
      children: Number(params.get('CHD') || 0),
      infants: Number(params.get('INF') || 0)
    },
    cabinClass: params.get('class') || 'Economy',
    specialFares: {}
  };
}

export function timeToMinutes(hhmm = '') {
  const match = String(hhmm).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function slotFor(minutes) {
  if (minutes < 360) return 'night';
  if (minutes < 720) return 'morning';
  if (minutes < 1080) return 'afternoon';
  return 'evening';
}

export function durationToMinutes(label = '') {
  const hours = /(\d+)\s*h/.exec(label);
  const mins = /(\d+)\s*m/.exec(label);
  return (hours ? Number(hours[1]) : 0) * 60 + (mins ? Number(mins[1]) : 0);
}

export function priceBounds(flights = []) {
  if (!flights.length) return { min: 0, max: 0 };
  const prices = flights.map((flight) => Number(flight.price) || 0);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function airlineOptions(flights = []) {
  const map = new Map();
  flights.forEach((flight) => {
    if (!flight.carrier || map.has(flight.carrier)) return;
    map.set(flight.carrier, {
      code: flight.carrier,
      name: flight.carrierName || flight.carrier,
      logo: flight.logo || ''
    });
  });
  const order = ['AI', 'IX', 'QP', '6E', 'BA', 'EK', 'QR', 'LH'];
  return [...map.values()].sort((a, b) => {
    const ai = order.indexOf(a.code);
    const bi = order.indexOf(b.code);
    return (ai === -1 ? 50 : ai) - (bi === -1 ? 50 : bi);
  });
}

export function filtersAreActive(filters, bounds) {
  if (!filters) return false;
  if (filters.departSlots?.length || filters.arriveSlots?.length) return true;
  if (filters.stops?.length || filters.airlines?.length) return true;
  if (filters.priceMin != null && bounds && filters.priceMin > bounds.min) return true;
  if (filters.priceMax != null && bounds && filters.priceMax < bounds.max) return true;
  return false;
}

function leg(flight) {
  return flight.outbound || flight;
}

export function filterFlights(flights = [], filters = EMPTY_FILTERS) {
  const bounds = priceBounds(flights);
  const min = filters.priceMin ?? bounds.min;
  const max = filters.priceMax ?? bounds.max;

  return flights.filter((flight) => {
    const price = Number(flight.price) || 0;
    if (price < min || price > max) return false;

    if (filters.stops?.length) {
      const stopKey = flight.stops >= 2 ? 2 : flight.stops;
      if (!filters.stops.includes(stopKey)) return false;
    }

    if (filters.airlines?.length && !filters.airlines.includes(flight.carrier)) return false;

    const departure = timeToMinutes(leg(flight).departureTime);
    const arrival = timeToMinutes(leg(flight).arrivalTime);
    if (filters.departSlots?.length && !filters.departSlots.includes(slotFor(departure))) return false;
    if (filters.arriveSlots?.length && !filters.arriveSlots.includes(slotFor(arrival))) return false;
    return true;
  });
}

function arrivalKey(flight) {
  const info = leg(flight);
  const departure = timeToMinutes(info.departureTime);
  let arrival = timeToMinutes(info.arrivalTime);
  const offset = parseInt(info.dayOffset, 10) || 0;
  if (offset) arrival += offset * 1440;
  else if (arrival < departure) arrival += 1440;
  return arrival;
}

export function sortFlights(flights = [], sort = DEFAULT_SORT) {
  const dir = sort?.dir === 'desc' ? -1 : 1;
  const key = sort?.key || 'price';
  return [...flights].sort((a, b) => {
    let cmp = 0;
    if (key === 'airline') cmp = (a.carrierName || '').localeCompare(b.carrierName || '');
    else if (key === 'departure') cmp = timeToMinutes(leg(a).departureTime) - timeToMinutes(leg(b).departureTime);
    else if (key === 'arrival') cmp = arrivalKey(a) - arrivalKey(b);
    else if (key === 'duration') cmp = durationToMinutes(leg(a).duration) - durationToMinutes(leg(b).duration);
    else cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
    if (cmp === 0) cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
    return cmp * dir;
  });
}

export function toggleSort(current, key) {
  if (current?.key === key) {
    return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { key, dir: 'asc' };
}
