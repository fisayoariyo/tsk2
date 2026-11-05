import React, { useState, useEffect } from 'react';
import { Plane, ShieldCheck, Utensils, Luggage, Phone, Mail, MessageSquare, Info, ChevronRight, X, Check, ArrowRight } from 'lucide-react';
import { fetchAirPrice } from '../services/airApi';

export default function BookingDetailsPage({
  flight,
  searchQuery,
  bookingForm,
  setBookingForm,
  onContinueToPreview,
  onNavigateBack
}) {
  const [ancillariesData, setAncillariesData] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'seat1' | 'seat2' | 'meal' | 'baggage' | null
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Fetch ancillaries from API (Seats, Meals, Baggage, Pricing)
  useEffect(() => {
    async function loadAncillaries() {
      const data = await fetchAirPrice(flight?.key || 'AI_511_1276_MAA_BOM_HDO_20261110');
      if (data) {
        setAncillariesData(data);
      }
    }
    loadAncillaries();
  }, [flight]);

  const segments = flight?.segments || [
    {
      flightNumber: "AI 511",
      carrierName: "Air India",
      fromCode: "MAA",
      fromCity: "Chennai",
      fromAirport: "Chennai Intl. Airport",
      fromTerminal: "Terminal 1",
      toCode: "BOM",
      toCity: "Mumbai",
      toAirport: "Chhatrapati Shivaji Intl. Airport",
      toTerminal: "Terminal 2",
      departureTime: "08:40",
      arrivalTime: "19:00",
      duration: "10h 20m",
      baggage: { cabin: "7 kg", checked: "15 kg" },
      stops: "1 stop (BOM)"
    },
    {
      flightNumber: "AI 1276",
      carrierName: "Air India",
      fromCode: "BOM",
      fromCity: "Mumbai",
      fromAirport: "Chhatrapati Shivaji Intl. Airport",
      fromTerminal: "Terminal 2",
      toCode: "HDO",
      toCity: "Ghaziabad",
      toAirport: "Hindon Airport",
      toTerminal: "Terminal 1",
      departureTime: "12:15",
      arrivalTime: "14:55",
      duration: "2h 40m",
      baggage: { cabin: "7 kg", checked: "15 kg" },
      stops: "Non-stop"
    }
  ];

  const baseFare = flight?.baseFare || 7906;
  const taxesAndFees = flight?.taxesAndFees || 3005;
  const mealCost = bookingForm.selectedMeal?.price || 0;
  const baggageCost = bookingForm.selectedBaggage?.price || 0;
  const seatCost = (bookingForm.selectedSeat1?.price || 0) + (bookingForm.selectedSeat2?.price || 0);

  const totalPayable = baseFare + taxesAndFees + mealCost + baggageCost + seatCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinueToPreview) {
      onContinueToPreview();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Top Breadcrumb Header (Screenshot 2) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onNavigateBack}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white font-black shadow-xs">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Fly<span className="text-[#FF5722]">high</span>
            </span>
          </div>

          {/* Stepper Navigation */}
          <div className="hidden md:flex items-center space-x-3 text-xs sm:text-sm font-semibold select-none">
            {/* Step 1: Booking Details */}
            <div className="flex items-center space-x-2 text-[#FF5722]">
              <span className="w-6 h-6 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                1
              </span>
              <span>Booking Details</span>
            </div>

            <div className="text-gray-300 font-mono tracking-widest">········</div>

            {/* Step 2: Preview */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Preview</span>
            </div>

            <div className="text-gray-300 font-mono tracking-widest">········</div>

            {/* Step 3: Make Payment */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Make Payment</span>
            </div>
          </div>

          {/* Help Action */}
          <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>Help</span>
          </div>

        </div>
      </header>

      {/* Main Content Form */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 py-7">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left Column (8 cols): Cards matching Screenshot 2 */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card 1: Flight Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900">
                  <Plane className="w-5 h-5 text-[#FF5722]" />
                  <span>Flight Details</span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Economy &bull; Regular
                </span>
              </div>

              {/* Route & Date Banner */}
              <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                <span className="text-gray-400">🗓</span>
                <span>Chennai (MAA) &rarr; Ghaziabad (HDO)</span>
                <span className="text-gray-400 font-normal">|</span>
                <span className="text-gray-600 font-medium">Tue, 10 Nov 2026</span>
              </div>

              {/* Connecting Legs */}
              <div className="space-y-4 pt-1">
                {/* Leg 1: Chennai -> Mumbai */}
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src="/logos/air-india.svg" alt="Air India" className="h-6 object-contain" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Air India</div>
                      <div className="text-[11px] text-gray-500">AI 511</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs sm:text-sm">
                    <div>
                      <div className="text-base font-black text-gray-900">08:40</div>
                      <div className="font-bold text-gray-700">Chennai (MAA)</div>
                      <div className="text-[10px] text-gray-400">Chennai Intl. Airport &bull; Terminal 1</div>
                    </div>

                    <div className="text-center px-2">
                      <div className="text-[11px] font-semibold text-gray-500">10h 20m</div>
                      <div className="w-20 h-0.5 bg-gray-300 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5722]"></div>
                      </div>
                      <div className="text-[10px] font-bold text-amber-600">1 stop (BOM)</div>
                    </div>

                    <div>
                      <div className="text-base font-black text-gray-900">19:00</div>
                      <div className="font-bold text-gray-700">Mumbai (BOM)</div>
                      <div className="text-[10px] text-gray-400">Chhatrapati Shivaji Intl. Airport &bull; Terminal 2</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>👜</span>
                      <span>7 kg</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>🧳</span>
                      <span>15 kg</span>
                    </div>
                  </div>
                </div>

                {/* Leg 2: Mumbai -> Ghaziabad */}
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src="/logos/air-india.svg" alt="Air India" className="h-6 object-contain" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Air India</div>
                      <div className="text-[11px] text-gray-500">AI 1276</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs sm:text-sm">
                    <div>
                      <div className="text-base font-black text-gray-900">12:15</div>
                      <div className="font-bold text-gray-700">Mumbai (BOM)</div>
                      <div className="text-[10px] text-gray-400">Chhatrapati Shivaji Intl. Airport &bull; Terminal 2</div>
                    </div>

                    <div className="text-center px-2">
                      <div className="text-[11px] font-semibold text-gray-500">2h 40m</div>
                      <div className="w-20 h-0.5 bg-gray-300 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5722]"></div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">Non-stop</div>
                    </div>

                    <div>
                      <div className="text-base font-black text-gray-900">14:55</div>
                      <div className="font-bold text-gray-700">Ghaziabad (HDO)</div>
                      <div className="text-[10px] text-gray-400">Hindon Airport &bull; Terminal 1</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>👜</span>
                      <span>7 kg</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>🧳</span>
                      <span>15 kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational Notice */}
              <div className="flex items-start space-x-2 text-xs text-gray-600 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Please check all the details of your journey including another services, baggage etc.</span>
              </div>
            </div>

            {/* Card 2: Traveller Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-150">
                <span className="text-lg">👤</span>
                <span>Traveller Details</span>
              </div>

              <div className="text-sm font-bold text-gray-900">1 Adult</div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-sm">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                  <select
                    value={bookingForm.traveller.title}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      traveller: { ...prev.traveller, title: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First & Middle Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.traveller.firstName}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      traveller: { ...prev.traveller, firstName: e.target.value }
                    }))}
                    placeholder="Rohan"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.traveller.lastName}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      traveller: { ...prev.traveller, lastName: e.target.value }
                    }))}
                    placeholder="Mehta"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
              </div>

              {/* Traveller Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 text-sm">
                <div className="sm:col-span-3 text-xs font-bold text-gray-700 flex items-center">
                  Traveller Contact
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email ID *</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      type="email"
                      required
                      value={bookingForm.traveller.email}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        traveller: { ...prev.traveller, email: e.target.value }
                      }))}
                      placeholder="rohan.mehta@example.com"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number *</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={bookingForm.traveller.phone}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        traveller: { ...prev.traveller, phone: e.target.value }
                      }))}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Travel Insurance (Optional) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#FF5722]" />
                <span>Travel Insurance (Optional)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bookingForm.insurance}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, insurance: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">
                      Add Travel Insurance for a safer journey.
                    </span>
                    <span className="text-xs text-gray-500">
                      Get coverage for trip cancellation, medical emergencies, baggage loss and more.
                    </span>
                  </div>
                </label>

                <div className="text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">
                  Coverage up to ₹10,00,000
                </div>
              </div>
            </div>

            {/* Card 4: Ancillary Options (Seats, Meals, Baggage) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              
              {/* Seats Section */}
              <div className="flex items-start justify-between py-2 border-b border-gray-150">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">💺</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Seats</div>
                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span>Chennai (MAA) &rarr; Mumbai (BOM)</span>
                        {bookingForm.selectedSeat1 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded">
                            {bookingForm.selectedSeat1.num} (₹{bookingForm.selectedSeat1.price})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Mumbai (BOM) &rarr; Ghaziabad (HDO)</span>
                        {bookingForm.selectedSeat2 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded">
                            {bookingForm.selectedSeat2.num} (₹{bookingForm.selectedSeat2.price})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-right shrink-0">
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('seat1')}
                      className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer flex items-center justify-end space-x-0.5"
                    >
                      <span>{bookingForm.selectedSeat1 ? 'Change Seat >' : 'Select Seat >'}</span>
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('seat2')}
                      className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer flex items-center justify-end space-x-0.5"
                    >
                      <span>{bookingForm.selectedSeat2 ? 'Change Seat >' : 'Select Seat >'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Meals Section */}
              <div className="flex items-center justify-between py-2 border-b border-gray-150">
                <div className="flex items-center space-x-3">
                  <Utensils className="w-5 h-5 text-[#FF5722]" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">Meals</div>
                    <div className="text-xs text-gray-500">
                      {bookingForm.selectedMeal ? (
                        <span className="text-emerald-700 font-semibold">
                          {bookingForm.selectedMeal.name} (+₹{bookingForm.selectedMeal.price})
                        </span>
                      ) : (
                        "Add meals for your flight"
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('meal')}
                  className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
                >
                  {bookingForm.selectedMeal ? 'Change Meal >' : 'Select Meal >'}
                </button>
              </div>

              {/* Baggage Section */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <Luggage className="w-5 h-5 text-[#FF5722]" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">Baggage</div>
                    <div className="text-xs text-gray-500">
                      {bookingForm.selectedBaggage ? (
                        <span className="text-emerald-700 font-semibold">
                          {bookingForm.selectedBaggage.weight} (+₹{bookingForm.selectedBaggage.price})
                        </span>
                      ) : (
                        "Need extra baggage? Add now and save more."
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('baggage')}
                  className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
                >
                  {bookingForm.selectedBaggage ? 'Change Baggage >' : 'Add Baggage >'}
                </button>
              </div>

            </div>

            {/* Card 5: GST Details (Optional) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-150">
                <span className="text-lg">📄</span>
                <span>GST Details (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={bookingForm.gst.gstin}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, gst: { ...prev.gst, gstin: e.target.value } }))}
                    placeholder="Enter GSTIN"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={bookingForm.gst.companyName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, gst: { ...prev.gst, companyName: e.target.value } }))}
                    placeholder="Enter company name"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Company Email</label>
                  <input
                    type="email"
                    value={bookingForm.gst.companyEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, gst: { ...prev.gst, companyEmail: e.target.value } }))}
                    placeholder="company@example.com"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Company Pin Code</label>
                  <input
                    type="text"
                    value={bookingForm.gst.companyPin}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, gst: { ...prev.gst, companyPin: e.target.value } }))}
                    placeholder="e.g. 400001"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            {/* Card 6: Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-150">
                <span className="text-lg">👤</span>
                <span>Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.firstName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, firstName: e.target.value } }))}
                    placeholder="Rohan"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.lastName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, lastName: e.target.value } }))}
                    placeholder="Mehta"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      type="email"
                      required
                      value={bookingForm.contact.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                      placeholder="rohan.mehta@example.com"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-sm">
                <div className="sm:col-span-7">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.address}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                    placeholder="A-120, Sector 62"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Country *</label>
                  <select
                    value={bookingForm.contact.country}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, country: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  >
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.state}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, state: e.target.value } }))}
                    placeholder="Uttar Pradesh"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.city}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, city: e.target.value } }))}
                    placeholder="Ghaziabad"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact.pincode}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, pincode: e.target.value } }))}
                    placeholder="201309"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />
                </div>
              </div>

              {/* Mobile with Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-sm">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Country Code *</label>
                  <select
                    value={bookingForm.contact.countryCode}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, countryCode: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  >
                    <option value="+91">+91 (India)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (US)</option>
                  </select>
                </div>

                <div className="sm:col-span-9">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number *</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={bookingForm.contact.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                      placeholder="98765 43210"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                  />
                  <span>
                    I agree to the <span className="text-[#FF5722] font-semibold underline">Terms & Conditions</span>, <span className="text-[#FF5722] font-semibold underline">Fare Rules</span> and <span className="text-[#FF5722] font-semibold underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              {/* Action Button: Continue to Preview -> */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FF5722] hover:bg-[#E64A19] text-white py-3.5 px-8 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer mt-4"
              >
                <span>Continue to Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Right Column (4 cols): Fare Summary & Sidecards matching Screenshot 2 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Fare Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-150">
                <span className="text-lg">🧾</span>
                <span>Fare Summary</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Passengers</span>
                  <span className="font-semibold text-gray-900">1 Adult</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Base Fare</span>
                  <span className="font-semibold text-gray-900">₹{baseFare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center space-x-1">
                    <span>Taxes & Fees</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  <span className="font-semibold text-gray-900">₹{taxesAndFees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {seatCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Seat Selection</span>
                    <span className="font-semibold text-gray-900">₹{seatCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {mealCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Meal Add-on</span>
                    <span className="font-semibold text-gray-900">₹{mealCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {baggageCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Extra Baggage</span>
                    <span className="font-semibold text-gray-900">₹{baggageCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-[#FF5722]">Total Payable</span>
                <span className="text-xl font-black text-[#FF5722]">
                  ₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Promo / Discounts Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-sm font-extrabold text-gray-900">
                <span className="text-base text-[#FF5722]">🏷</span>
                <span>Promo / Discounts</span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter offer code"
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                />
                <button
                  type="button"
                  onClick={() => setPromoApplied(true)}
                  className="border border-[#FF5722] text-[#FF5722] hover:bg-orange-50 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoApplied && (
                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                  Code applied! No extra fee charged.
                </div>
              )}
            </div>

            {/* Plan Your Mumbai Trip Promo Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-200 group">
              <img
                src="/mumbai-promo.png"
                alt="Gateway of India"
                className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                <h4 className="text-lg font-black leading-tight drop-shadow-sm">
                  Plan Your<br />Mumbai Trip
                </h4>
                <p className="text-xs text-white/90 mt-1">
                  Great fares, flexible options and more with Flyhigh.
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center space-x-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white px-4 py-1.5 rounded-lg text-xs font-bold w-max shadow-sm"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Need help? Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3.5 text-xs">
              <div className="flex items-center space-x-2 text-sm font-extrabold text-gray-900">
                <Phone className="w-4 h-4 text-[#FF5722]" />
                <span>Need help?</span>
              </div>
              <p className="text-gray-500">
                Our travel experts are here 24x7 to assist you.
              </p>
              <div className="space-y-2.5 pt-1 text-gray-800 font-semibold">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>+91 1800 123 4567</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>support@flyhigh.com</span>
                </div>
                <div className="flex items-center space-x-2.5 cursor-pointer text-[#FF5722]">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Live Chat</span>
                </div>
              </div>
            </div>

          </div>

        </form>
      </main>

      {/* Modals for Ancillaries: Seat Selection, Meals, Extra Baggage */}
      {/* 1. Seat Selection Modal for Segment 1 & 2 */}
      {(activeModal === 'seat1' || activeModal === 'seat2') && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <h3 className="text-base font-extrabold text-gray-900">
                Select Seat: {activeModal === 'seat1' ? 'Chennai (MAA) → Mumbai (BOM)' : 'Mumbai (BOM) → Ghaziabad (HDO)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Pick your preferred seat for this leg. Window and extra legroom seats carry a small fee.
            </p>

            <div className="grid grid-cols-3 gap-2.5 py-2">
              {[
                { num: "12A", type: "Window", price: 250 },
                { num: "12B", type: "Middle", price: 0 },
                { num: "12C", type: "Aisle", price: 200 },
                { num: "14A", type: "Window", price: 350 },
                { num: "14B", type: "Middle", price: 0 },
                { num: "14C", type: "Aisle", price: 250 }
              ].map((seat) => {
                const currentSeat = activeModal === 'seat1' ? bookingForm.selectedSeat1 : bookingForm.selectedSeat2;
                const isSelected = currentSeat?.num === seat.num;

                return (
                  <button
                    key={seat.num}
                    type="button"
                    onClick={() => {
                      if (activeModal === 'seat1') {
                        setBookingForm(prev => ({ ...prev, selectedSeat1: seat }));
                      } else {
                        setBookingForm(prev => ({ ...prev, selectedSeat2: seat }));
                      }
                      setActiveModal(null);
                    }}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50 text-[#FF5722] font-black'
                        : 'border-gray-200 hover:border-gray-300 text-gray-800'
                    }`}
                  >
                    <div className="text-sm font-bold">{seat.num}</div>
                    <div className="text-[10px] text-gray-500">{seat.type}</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">
                      {seat.price === 0 ? 'Free' : `₹${seat.price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Meal Selection Modal */}
      {activeModal === 'meal' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <h3 className="text-base font-extrabold text-gray-900">Select In-Flight Meal</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(ancillariesData?.meals || [
                { id: "m1", name: "Herb Roast Vegetable Roll", price: 0, description: "Included vegetarian fresh roll" },
                { id: "m2", name: "Butter Chicken & Jeera Rice", price: 350, description: "Hot Indian gourmet chicken curry" },
                { id: "m3", name: "Paneer Tikka Biryani", price: 300, description: "Aromatic basmati rice with paneer" },
                { id: "m4", name: "Special Jain Meal", price: 0, description: "Prepared strictly as per Jain dietary guidelines" }
              ]).map((m) => {
                const isSelected = bookingForm.selectedMeal?.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setBookingForm(prev => ({ ...prev, selectedMeal: m }));
                      setActiveModal(null);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/60'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                    <div className="text-sm font-bold text-[#FF5722] shrink-0 pl-3">
                      {m.price === 0 ? 'Included' : `+ ₹${m.price}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Extra Baggage Modal */}
      {activeModal === 'baggage' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <h3 className="text-base font-extrabold text-gray-900">Add Extra Baggage Allowance</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(ancillariesData?.bags || [
                { id: "b0", weight: "Included baggage (7 kg cabin + 15 kg checked)", price: 0 },
                { id: "b1", weight: "+ 5 Kg", price: 3750, description: "Extra 5 kg checked bag" },
                { id: "b2", weight: "+ 10 Kg", price: 7500, description: "Extra 10 kg checked bag" },
                { id: "b3", weight: "+ 15 Kg", price: 11250, description: "Extra 15 kg checked bag" }
              ]).map((b) => {
                const isSelected = bookingForm.selectedBaggage?.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setBookingForm(prev => ({ ...prev, selectedBaggage: b.price === 0 ? null : b }));
                      setActiveModal(null);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/60'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">{b.weight}</div>
                      {b.description && <div className="text-xs text-gray-500">{b.description}</div>}
                    </div>
                    <div className="text-sm font-bold text-[#FF5722] shrink-0 pl-3">
                      {b.price === 0 ? 'Standard' : `+ ₹${b.price}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
