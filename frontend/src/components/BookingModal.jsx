import React, { useState } from 'react';
import { X, Check, Plane, ShieldCheck, Utensils, Luggage, ArrowRight, CheckCircle2, ArrowLeftRight } from 'lucide-react';

export default function BookingModal({ flight, onClose, onBookingComplete }) {
  const [step, setStep] = useState('review'); // 'review' | 'success'
  const [selectedMeal, setSelectedMeal] = useState('m1');
  const [selectedBaggage, setSelectedBaggage] = useState('none');
  const [passenger, setPassenger] = useState({
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+44 7911 123456'
  });
  const [pnr, setPnr] = useState('');

  if (!flight) return null;

  const baseFare = Math.round(flight.price * 0.78);
  const tax = Math.round(flight.price * 0.19);
  const irctcCharge = 100;
  const gst = 18;

  const mealAddon = selectedMeal === 'm2' ? 350 : selectedMeal === 'm3' ? 300 : 0;
  const bagAddon = selectedBaggage === 'b1' ? 3750 : selectedBaggage === 'b2' ? 7500 : 0;

  const grandTotal = flight.price + mealAddon + bagAddon;

  const handleConfirmBooking = () => {
    const generatedPnr = 'FH' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setPnr(generatedPnr);
    setStep('success');
    if (onBookingComplete) onBookingComplete(generatedPnr);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-gray-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FF5722] to-[#E04006] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {step === 'review' ? 'Review & Book Flight' : 'Booking Confirmed!'}
              </h3>
              <p className="text-xs text-white/80 font-medium inline-flex items-center gap-1">
                <span>{flight.carrierName} • {flight.outbound.fromCode}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                <span>{flight.outbound.toCode}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'review' ? (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Flight Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img src={flight.logo} alt={flight.carrierName} className="h-6 object-contain" />
                  <span className="font-bold text-gray-900">{flight.carrierName}</span>
                  <span className="text-xs bg-orange-100 text-[#FF5722] px-2.5 py-0.5 rounded-full font-bold">
                    {flight.stopLabel}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-500">
                  {flight.fareFamily}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-gray-500 font-medium">Outbound Journey</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {flight.outbound.departureTime} {flight.outbound.fromCode} → {flight.outbound.arrivalTime} {flight.outbound.toCode}
                  </div>
                  <div className="text-gray-500 text-xs">{flight.outbound.duration}</div>
                </div>

                <div>
                  <div className="text-gray-500 font-medium">Return Journey</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {flight.inbound.departureTime} {flight.inbound.fromCode} → {flight.inbound.arrivalTime} {flight.inbound.toCode}
                  </div>
                  <div className="text-gray-500 text-xs">{flight.inbound.duration}</div>
                </div>
              </div>
            </div>

            {/* Passenger Info Form */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Passenger Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => setPassenger({ ...passenger, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => setPassenger({ ...passenger, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            {/* In-Flight Meal Option */}
            <div>
              <div className="flex items-center space-x-2 font-bold text-gray-900 text-sm mb-2.5">
                <Utensils className="w-4 h-4 text-[#FF5722]" />
                <span>Meal Selection</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'm1', name: 'Vegetable Roll', price: 'Included' },
                  { id: 'm2', name: 'Butter Chicken Meal', price: '+ ₹350' },
                  { id: 'm3', name: 'Paneer Biryani', price: '+ ₹300' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMeal(m.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedMeal === m.id
                        ? 'border-[#FF5722] bg-orange-50/50 text-[#FF5722]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.name}</div>
                    <div className="text-[11px] font-semibold mt-1">{m.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Breakdown Card (as per API Study) */}
            <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-gray-900 text-sm mb-1">Fare Breakdown</div>
              <div className="flex justify-between text-gray-600">
                <span>Base Fare</span>
                <span className="font-semibold text-gray-900">₹{baseFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Airline Fees</span>
                <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Convenience Fee & GST</span>
                <span className="font-semibold text-gray-900">₹{(irctcCharge + gst).toLocaleString('en-IN')}</span>
              </div>
              {mealAddon > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Meal Add-on</span>
                  <span className="font-semibold text-gray-900">₹{mealAddon}</span>
                </div>
              )}
              <div className="pt-2 border-t border-orange-200 flex justify-between text-sm font-extrabold text-[#FF5722]">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white py-3.5 px-6 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              <span>Confirm & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900">Flight Booked Successfully!</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your ticket has been confirmed. A confirmation email was sent to {passenger.email}.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-sm mx-auto text-left space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Booking Reference (PNR)</span>
                <span className="font-black text-gray-900 text-base text-[#FF5722]">{pnr}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Passenger</span>
                <span className="font-bold text-gray-900">{passenger.firstName} {passenger.lastName}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Flight</span>
                <span className="font-bold text-gray-900">{flight.carrierName} ({flight.flightNumber})</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Route</span>
                <span className="font-bold text-gray-900 inline-flex items-center gap-1">
                  {flight.outbound.fromCode}
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  {flight.outbound.toCode}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#0F2038] hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm transition"
            >
              Close & View Flights
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
