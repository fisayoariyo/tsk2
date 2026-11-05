const CARRIERS = [
  { carrier: '6E', carrierName: 'IndiGo', logo: '/logos/indigo.svg', flight: '6E 204' },
  { carrier: 'AI', carrierName: 'Air India', logo: '/logos/air-india.svg', flight: 'AI 544' },
  { carrier: 'IX', carrierName: 'Air India Express', logo: '/logos/air-india-express.svg', flight: 'IX 1524' },
  { carrier: 'QP', carrierName: 'Akasa Air', logo: '/logos/akasa.svg', flight: 'QP 1408' }
];

function codeFrom(label = '') {
  const match = String(label).match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = String(label).trim();
  return /^[A-Za-z]{3}$/.test(trimmed) ? trimmed.toUpperCase() : '';
}

function cityFrom(label = '', fallback = '') {
  const city = String(label).replace(/\s*\([A-Za-z]{3}\)\s*$/, '').trim();
  return city || fallback;
}

function isoDate(value) {
  const iso = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = String(value || '').match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  return '2026-12-15';
}

function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

function dateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  return `${weekday}, ${String(d).padStart(2, '0')} ${month}`;
}

function hash(text) {
  let n = 0;
  const key = String(text);
  for (let i = 0; i < key.length; i += 1) n = (n * 33 + key.charCodeAt(i)) >>> 0;
  return n;
}

function rupees(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

function oneWayFlight(spec, classOfTravel) {
  const stops = spec.stops;
  const stopType = stops === 0 ? '0 Stop' : '1 Stop';
  return {
    key: spec.key,
    carrier: spec.carrier,
    carrierName: spec.carrierName,
    flightNumber: spec.flightNumber,
    logo: spec.logo,
    stops,
    stopLabel: stopType,
    price: spec.price,
    formattedPrice: rupees(spec.price),
    baseFare: Math.round(spec.price * 0.725),
    taxesAndFees: spec.price - Math.round(spec.price * 0.725),
    convenienceFee: 118,
    fareCondition: 'Partially Refundable',
    cabinClass: classOfTravel,
    outbound: {
      fromCode: spec.fromCode,
      fromCity: spec.fromCity,
      toCode: spec.toCode,
      toCity: spec.toCity,
      departureTime: spec.dep,
      arrivalTime: spec.arr,
      duration: spec.duration,
      stops,
      stopType,
      dayOffset: spec.dayOffset || ''
    }
  };
}

function leg(spec) {
  return {
    key: spec.key,
    carrier: spec.carrier,
    carrierName: spec.carrierName,
    flightNumber: spec.flightNumber,
    logo: spec.logo,
    fromCode: spec.fromCode,
    fromCity: spec.fromCity,
    toCode: spec.toCode,
    toCity: spec.toCity,
    departureTime: spec.dep,
    arrivalTime: spec.arr,
    duration: spec.duration,
    stops: spec.stops,
    stopType: spec.stops === 0 ? 'Non-stop' : '1 Stop',
    cabinClass: spec.classOfTravel,
    seatsLeft: spec.seatsLeft,
    fareType: spec.fareType,
    price: spec.price,
    formattedPrice: rupees(spec.price),
    baggage: { cabin: '7 Kg included', checked: '15 Kg included' }
  };
}

export function localSearch(params = {}) {
  const originCode = codeFrom(params.origin) || 'BOM';
  const destCode = codeFrom(params.destination) || 'DEL';
  const originCity = params.originCity || cityFrom(params.origin, 'Mumbai');
  const destCity = params.destinationCity || cityFrom(params.destination, 'Delhi');
  const classOfTravel = params.classOfTravel || 'Economy';
  const adults = Number(params.noOfAdults || 1);
  const children = Number(params.noOfChildren || 0);
  const infants = Number(params.noOfInfants || 0);
  const totalPax = Math.max(1, adults + children + infants);
  const depart = isoDate(params.departureDate);
  const ret = isoDate(params.returnDate);
  const roundTrip = params.tripType === 'R';

  if (roundTrip) {
    const times = [
      ['06:10', '08:45', '2h 35m', 0, 4],
      ['08:30', '11:10', '2h 40m', 0, 6],
      ['14:15', '17:05', '2h 50m', 1, 5],
      ['19:25', '22:15', '2h 50m', 0, 3]
    ];
    const buildLeg = (fromCode, fromCity, toCode, toCity, direction) => times.map((row, index) => {
      const carrier = CARRIERS[index % CARRIERS.length];
      const price = (18900 + index * 600) * totalPax;
      return leg({
        key: `${carrier.carrier}_${fromCode}_${toCode}_${direction}${index}`,
        ...carrier,
        flightNumber: carrier.flight,
        fromCode,
        fromCity,
        toCode,
        toCity,
        dep: row[0],
        arr: row[1],
        duration: row[2],
        stops: row[3],
        seatsLeft: row[4],
        fareType: 'Saver',
        classOfTravel,
        price
      });
    });
    const outboundFlights = buildLeg(originCode, originCity, destCode, destCity, 'O');
    const returnFlights = buildLeg(destCode, destCity, originCode, originCity, 'R');
    return {
      tripType: 'R',
      isSplitView: true,
      searchSummary: {
        origin: `${originCity} (${originCode})`,
        originCode,
        originCity,
        destination: `${destCity} (${destCode})`,
        destinationCode: destCode,
        destinationCity: destCity,
        departureDate: depart,
        returnDate: ret,
        travellers: { adults, children, infants, total: totalPax },
        classOfTravel
      },
      outboundFlights,
      returnFlights,
      flights: outboundFlights,
      selectedOutboundKey: null,
      selectedReturnKey: null
    };
  }

  const rows = [
    ['06:55', '09:40', '2h 45m', 0, ''],
    ['09:15', '14:20', '5h 5m', 1, ''],
    ['13:10', '16:00', '2h 50m', 0, ''],
    ['16:45', '21:30', '4h 45m', 1, ''],
    ['19:40', '22:30', '2h 50m', 0, ''],
    ['21:55', '00:40', '2h 45m', 0, '+1']
  ];
  const flights = rows.map((row, index) => {
    const carrier = CARRIERS[index % CARRIERS.length];
    const price = 6400 + (hash(`${originCode}${destCode}${depart}${index}`) % 18) * 350;
    return oneWayFlight({
      key: `${carrier.carrier}_${originCode}_${destCode}_${index}`,
      ...carrier,
      flightNumber: carrier.flight,
      fromCode: originCode,
      fromCity: originCity,
      toCode: destCode,
      toCity: destCity,
      dep: row[0],
      arr: row[1],
      duration: row[2],
      stops: row[3],
      dayOffset: row[4],
      price
    }, classOfTravel);
  });

  return {
    tripType: 'O',
    isSplitView: false,
    totalResults: flights.length,
    searchSummary: {
      origin: `${originCity} (${originCode})`,
      originCity,
      destination: `${destCity} (${destCode})`,
      destinationCity: destCity,
      departureDate: depart,
      classOfTravel
    },
    flights
  };
}

export function localLowFares(origin, destination, searchDate) {
  const center = isoDate(searchDate);
  const rows = [];
  for (let offset = -7; offset <= 7; offset += 1) {
    const date = addDays(center, offset);
    rows.push({
      price: String(6800 + (hash(`${origin}${destination}${date}`) % 23) * 70),
      date,
      dateString: dateLabel(date),
      isLowFareAvailable: false
    });
  }
  const cheapest = Math.min(...rows.map((row) => Number(row.price)));
  rows.forEach((row) => {
    row.isLowFareAvailable = Number(row.price) === cheapest;
  });
  return rows;
}
