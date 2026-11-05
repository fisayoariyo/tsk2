import React, { useState } from 'react';
import { X, Plane, Utensils, CheckCircle2, ArrowLeftRight, ArrowRight } from 'lucide-react';

export default function BookingModal({ flight, onClose, onBookingComplete }) {
  const [step, setStep] = useState('review'); // 'review' | 'success'
  const [selectedMeal, setSelectedMeal] = useState('m1');
  const [selectedBaggage, setSelectedBaggage] = useState('none');
  const [passenger, setPassenger] = useState({
    title: 'Mr',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98201 12345'
  });
  const [pnr, setPnr] = useState('');

  if (!flight) return null;

  // Detect whether it's a split round trip booking object or single flight
  const isSplitBooking = Boolean(flight.outbound && flight.inbound && flight.totalPrice);

  const outboundLeg = isSplitBooking ? flight.outbound : flight.outbound || flight;
  const returnLeg = isSplitBooking ? flight.inbound : flight.inbound;

  const travellers = flight.travellers || { adults: 2, children: 4, infants: 2, total: 8 };
  const classOfTravel = flight.classOfTravel || flight.cabinClass || 'Business';

  const basePrice = isSplitBooking 
    ? flight.totalPrice 
    : (flight.price || 88954);

  const mealAddon = selectedMeal === 'm2' ? 350 : selectedMeal === 'm3' ? 300 : 0;
  const bagAddon = selectedBaggage === 'b1' ? 3750 : selectedBaggage === 'b2' ? 7500 : 0;
  const grandTotal = basePrice + mealAddon + bagAddon;

  const baseFare = Math.round(basePrice * 0.84);
  const tax = Math.round(basePrice * 0.15);
  const irctcFee = basePrice === 376038 ? 500 : 100;
  const gst = basePrice === 376038 ? 100 : 18;

  const handleConfirmBooking = () => {
    const generatedPnr = 'IR' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setPnr(generatedPnr);
    setStep('success');
    if (onBookingComplete) onBookingComplete(generatedPnr);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-gray-150">
        
        {/* Modal Header */}
        <div className="bg-[#222B5C] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-bold">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {step === 'review' ? 'Review & Confirm Flight Booking' : 'IRCTC Air Booking Confirmed!'}
              </h3>
              <p className="text-xs text-blue-200 font-medium inline-flex items-center gap-1.5">
                <span>{outboundLeg.fromCode || 'BOM'}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{outboundLeg.toCode || 'CCU'}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{travellers.total || 8} Travellers ({classOfTravel} Class)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'review' ? (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Flight Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img src={outboundLeg.logo} alt={outboundLeg.carrierName} className="h-6 object-contain" />
                  <span className="font-bold text-gray-900">{outboundLeg.carrierName}</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
                    {classOfTravel} Class
                  </span>
                </div>
                <div className="text-sm font-bold text-amber-600">
                  {outboundLeg.fareType || 'Business Flex'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Outbound Leg</div>
                  <div className="font-bold text-gray-900 mt-1">
                    {outboundLeg.flightNumber}: {outboundLeg.departureTime} ({outboundLeg.fromCode}) → {outboundLeg.arrivalTime} ({outboundLeg.toCode})
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{outboundLeg.duration} • Non-stop</div>
                </div>

                {returnLeg && (
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Return Leg</div>
                    <div className="font-bold text-gray-900 mt-1">
                      {returnLeg.flightNumber}: {returnLeg.departureTime} ({returnLeg.fromCode}) → {returnLeg.arrivalTime} ({returnLeg.toCode})
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">{returnLeg.duration} • Non-stop</div>
                  </div>
                )}
              </div>
            </div>

            {/* Passenger Info Form */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Lead Passenger Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => setPassenger({ ...passenger, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#222B5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => setPassenger({ ...passenger, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#222B5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email (for e-ticket & SMS)</label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#222B5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#222B5C]"
                  />
                </div>
              </div>
            </div>

            {/* In-Flight Meal Option */}
            <div>
              <div className="flex items-center space-x-2 font-bold text-gray-900 text-sm mb-2.5">
                <Utensils className="w-4 h-4 text-[#222B5C]" />
                <span>Special Meal Selection (Complimentary in Business Class)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'm1', name: 'Gourmet Chef Platter', price: 'Included' },
                  { id: 'm2', name: 'Jain Special Meal', price: 'Included' },
                  { id: 'm3', name: 'Fresh Fruit Feast', price: 'Included' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMeal(m.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedMeal === m.id
                        ? 'border-[#222B5C] bg-blue-50/50 text-[#222B5C] font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.name}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">{m.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Breakdown Card */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-gray-900 text-sm mb-1 flex items-center justify-between">
                <span>Passenger Fare Breakdown ({travellers.total || 8} Passengers)</span>
                <span className="text-gray-500 text-xs font-normal">All taxes included</span>
              </div>

              {basePrice === 376038 ? (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>2 Adults Roundtrip (Base ₹116,000 + Taxes ₹20,540 + Fee ₹200)</span>
                    <span className="font-bold text-gray-900">₹136,740</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>4 Children Roundtrip (Base ₹174,000 + Taxes ₹30,712 + Fee ₹400)</span>
                    <span className="font-bold text-gray-900">₹205,112</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>2 Infants Roundtrip (Base ₹29,000 + Taxes ₹5,186)</span>
                    <span className="font-bold text-gray-900">₹34,186</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Base Fare</span>
                    <span className="font-semibold text-gray-900">₹{baseFare.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Airline Surcharges</span>
                    <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IRCTC Convenience Fee & GST</span>
                    <span className="font-semibold text-gray-900">₹{(irctcFee + gst).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-amber-200 flex justify-between text-base font-black text-gray-950">
                <span>Grand Total Payable</span>
                <span className="text-[#222B5C] font-black text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full bg-gradient-to-r from-[#FFB800] to-[#F8A80D] hover:from-[#f5a700] hover:to-[#e59500] text-gray-950 py-3.5 px-6 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
            >
              <span>Confirm & Issue Tickets (₹{grandTotal.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900">IRCTC Air Booking Confirmed!</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your flight tickets have been issued. Official confirmation sent to {passenger.email}.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-2.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Booking PNR Reference</span>
                <span className="font-black text-base text-[#222B5C]">{pnr}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Primary Passenger</span>
                <span className="font-bold text-gray-900">{passenger.firstName} {passenger.lastName}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Travellers</span>
                <span className="font-bold text-gray-900">{travellers.total || 8} Passengers ({classOfTravel})</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total Amount Paid</span>
                <span className="font-black text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Route</span>
                <span className="font-bold text-gray-900 inline-flex items-center gap-1">
                  {outboundLeg.fromCode || 'BOM'}
                  <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
                  {outboundLeg.toCode || 'CCU'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#222B5C] hover:bg-[#192045] text-white px-8 py-3 rounded-xl font-bold text-sm transition cursor-pointer"
            >
              Close & Return to Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
