import React, { useState } from 'react';
import { Plane, Phone, Check, ArrowLeft, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { bookFlight } from '../services/airApi';

export default function PreviewPage({
  flight,
  searchQuery,
  bookingForm,
  onBackToBooking,
  onConfirmPayment
}) {
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseFare = flight?.baseFare || 7906;
  const taxesAndFees = flight?.taxesAndFees || 3005;
  const convenienceFee = 118;
  const mealCost = bookingForm?.selectedMeal?.price || 0;
  const baggageCost = bookingForm?.selectedBaggage?.price || 0;
  const seatCost = (bookingForm?.selectedSeat1?.price || 0) + (bookingForm?.selectedSeat2?.price || 0);
  const totalPayable = baseFare + taxesAndFees + convenienceFee + mealCost + baggageCost + seatCost;

  const passengerName = [
    bookingForm?.traveller?.firstName,
    bookingForm?.traveller?.lastName
  ].filter(Boolean).join(' ') || 'Jdh Jhd';

  const maskEmail = (email) => {
    if (!email) return 'rajkush***@gmail.com';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    return user.slice(0, 3) + '***@' + domain;
  };

  const maskPhone = (phone) => {
    if (!phone) return '+91 99489 8****';
    const digits = phone.replace(/\D/g, '');
    return '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5, 6) + '****';
  };

  const handleConfirm = async () => {
    if (!agreed1 || !agreed2) {
      alert('Please agree to both checkboxes to continue.');
      return;
    }
    setLoading(true);
    try {
      const result = await bookFlight({
        flightKey: flight?.key || 'AI_511_1276_MAA_BOM_HDO_20261110',
        traveller: bookingForm?.traveller,
        contact: bookingForm?.contact,
        gst: bookingForm?.gst,
        insurance: bookingForm?.insurance,
        selectedSeat1: bookingForm?.selectedSeat1,
        selectedSeat2: bookingForm?.selectedSeat2,
        selectedMeal: bookingForm?.selectedMeal,
        selectedBaggage: bookingForm?.selectedBaggage
      });
      if (onConfirmPayment) onConfirmPayment(result);
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Top Header — Step 2 Active */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onBackToBooking}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white font-black shadow-sm">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Fly<span className="text-[#FF5722]">high</span>
            </span>
          </div>

          {/* Stepper */}
          <div className="hidden md:flex items-center space-x-3 text-xs sm:text-sm font-semibold select-none">
            {/* Step 1: Done */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-6 h-6 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="line-through text-gray-400">Booking Details</span>
            </div>

            <div className="text-gray-300 font-mono tracking-widest">········</div>

            {/* Step 2: Active */}
            <div className="flex items-center space-x-2 text-[#FF5722]">
              <span className="w-6 h-6 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                2
              </span>
              <span>Preview</span>
            </div>

            <div className="text-gray-300 font-mono tracking-widest">········</div>

            {/* Step 3: Inactive */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Make Payment</span>
            </div>
          </div>

          {/* Help */}
          <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>Help</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          {/* ── Left Column (8 cols) ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Card 1: Flight Details (read-only) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900">
                  <Plane className="w-5 h-5 text-[#FF5722]" />
                  <span>Flight Details</span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Economy · Regular
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center space-x-2 text-sm font-bold text-gray-800 flex-wrap gap-1">
                <span className="text-gray-400">🗓</span>
                <span>Chennai (MAA)</span>
                <span className="text-gray-400">→</span>
                <span>Mumbai (BOM)</span>
                <span className="text-gray-400">→</span>
                <span>Ghaziabad (HDO)</span>
                <span className="text-gray-400 font-normal mx-1">|</span>
                <span className="text-gray-600 font-medium">Tue, 10 Nov 2026</span>
              </div>

              <div className="space-y-3">
                {/* Leg 1 */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                      <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Air India</div>
                      <div className="text-[11px] text-gray-500">AI 511</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs sm:text-sm flex-1">
                    <div>
                      <div className="text-base font-black text-gray-900">06:55</div>
                      <div className="font-bold text-gray-700">Chennai (MAA)</div>
                      <div className="text-[10px] text-gray-400">Chennai Intl. Airport · Terminal 1</div>
                    </div>

                    <div className="text-center px-2 flex-1">
                      <div className="text-[11px] font-semibold text-gray-500">2h 5m</div>
                      <div className="relative h-0.5 bg-gray-300 my-1.5">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF5722]" />
                      </div>
                      <div className="text-[10px] font-bold text-amber-600">1 stop (BOM)</div>
                    </div>

                    <div>
                      <div className="text-base font-black text-gray-900">09:00</div>
                      <div className="font-bold text-gray-700">Mumbai (BOM)</div>
                      <div className="text-[10px] text-gray-400">Chhatrapati Shivaji Intl. · Terminal 1</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>👜</span><span>7 kg</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>🧳</span><span>15 kg</span>
                    </div>
                  </div>
                </div>

                {/* Stop Banner */}
                <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
                  <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                    <Plane className="w-3 h-3 text-amber-700 rotate-90" />
                  </div>
                  <span>Stop in Mumbai (BOM)</span>
                  <span className="ml-auto text-amber-600 font-normal">Connection time: 1h 15m</span>
                </div>

                {/* Leg 2 */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                      <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Air India</div>
                      <div className="text-[11px] text-gray-500">AI 1276</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs sm:text-sm flex-1">
                    <div>
                      <div className="text-base font-black text-gray-900">10:15</div>
                      <div className="font-bold text-gray-700">Mumbai (BOM)</div>
                      <div className="text-[10px] text-gray-400">Chhatrapati Shivaji Intl. · Terminal 1</div>
                    </div>

                    <div className="text-center px-2 flex-1">
                      <div className="text-[11px] font-semibold text-gray-500">1h 30m</div>
                      <div className="relative h-0.5 bg-gray-300 my-1.5">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">Non-stop</div>
                    </div>

                    <div>
                      <div className="text-base font-black text-gray-900">12:45</div>
                      <div className="font-bold text-gray-700">Ghaziabad (HDO)</div>
                      <div className="text-[10px] text-gray-400">Hindon Airport · Terminal 1</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>👜</span><span>7 kg</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <span>🧳</span><span>15 kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start space-x-2 text-xs text-gray-600 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Please verify all the journey details including another services, baggage etc. before proceeding to payment.</span>
              </div>
            </div>

            {/* Card 2: Passenger Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                <span className="text-lg">👤</span>
                <span>Passenger Details</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">S. No.</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Passenger Name</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Type</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Date of Birth</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-4 text-gray-900">1</td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{passengerName}</td>
                      <td className="py-3 pr-4 text-gray-600">Adult</td>
                      <td className="py-3 pr-4 text-gray-600">NA</td>
                      <td className="py-3 text-gray-600 capitalize">
                        {bookingForm?.traveller?.title === 'Mrs.' || bookingForm?.traveller?.title === 'Ms.'
                          ? 'Female' : 'Male'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 3: Travel Insurance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                <ShieldCheck className="w-5 h-5 text-[#FF5722]" />
                <span>Travel Insurance</span>
              </div>

              {bookingForm?.insurance !== false ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="font-bold text-sm text-emerald-800">Free Travel Insurance included</span>
                  </div>
                  <button type="button" className="text-xs font-semibold text-[#FF5722] hover:underline cursor-pointer">
                    View coverage details &gt;
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No travel insurance selected.</div>
              )}
            </div>

            {/* Card 4: Ancillary Services */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                <span className="text-lg">🎒</span>
                <span>Ancillary Services</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Passenger</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Journey</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Seat No.</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2 pr-4">Meal</th>
                      <th className="text-left text-xs font-bold text-gray-700 py-2">Baggage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 last:border-0 align-top">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{passengerName}</td>
                      <td className="py-3 pr-4 text-gray-600 text-xs leading-5">
                        Chennai (MAA) → Mumbai (BOM)<br />
                        Mumbai (BOM) → Ghaziabad (HDO)
                      </td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">
                        {bookingForm?.selectedSeat1
                          ? <span className="font-semibold text-gray-800">{bookingForm.selectedSeat1.num}</span>
                          : 'Not selected'}
                      </td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">
                        {bookingForm?.selectedMeal
                          ? <span className="font-semibold text-gray-800">{bookingForm.selectedMeal.name}</span>
                          : 'Not selected'}
                      </td>
                      <td className="py-3 text-gray-600 text-xs">
                        {bookingForm?.selectedBaggage
                          ? <span className="font-semibold text-gray-800">{bookingForm.selectedBaggage.weight} extra</span>
                          : 'Included baggage\n(7 kg cabin + 15 kg checked)'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-start space-x-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Optional extras (seat, meal, baggage) can be changed before payment.</span>
              </div>
            </div>

            {/* Card 5: Contact Information (read-only) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                <span className="text-lg">📞</span>
                <span>Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-sm">
                <InfoRow label="First Name" value={bookingForm?.contact?.firstName || bookingForm?.traveller?.firstName || 'Jdh'} />
                <InfoRow label="Last Name" value={bookingForm?.contact?.lastName || bookingForm?.traveller?.lastName || 'Jhd'} />
                <InfoRow label="Email" value={maskEmail(bookingForm?.contact?.email || bookingForm?.traveller?.email)} />
                <InfoRow label="Mobile Number" value={maskPhone(bookingForm?.contact?.phone || bookingForm?.traveller?.phone)} />
                <InfoRow label="Address" value={bookingForm?.contact?.address || 'Kuel'} />
                <InfoRow label="State" value={bookingForm?.contact?.state || 'Kuel'} />
                <InfoRow label="City" value={bookingForm?.contact?.city || 'Jhd'} />
                <InfoRow label="Country" value={bookingForm?.contact?.country || 'BAHAMAS'} />
                <InfoRow label="Pincode" value={bookingForm?.contact?.pincode || '222929'} />
              </div>
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={agreed1}
                  onChange={(e) => setAgreed1(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#FF5722] accent-[#FF5722] border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#FF5722] font-semibold underline cursor-pointer">Airline & User Terms and Conditions</span>
                  {' '}and agree to pay the total amount & applicable payment gateway charges.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed2}
                  onChange={(e) => setAgreed2(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#FF5722] accent-[#FF5722] border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  I confirm that I have checked all the journey details, passenger names and ancillary services (seat, meal, baggage etc.).
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onBackToBooking}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-gray-400 text-gray-700 hover:bg-gray-50 font-bold py-3.5 px-8 rounded-2xl text-sm transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to booking details</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-60 text-white font-bold py-3.5 px-8 rounded-2xl text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Confirm details & continue to payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ── Right Column (4 cols) ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Fare Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                <span className="text-lg">🧾</span>
                <span>Fare Summary</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Passengers</span>
                  <span className="font-semibold text-gray-900">1 Adult</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Base Fare</span>
                  <span className="font-semibold text-gray-900">
                    ₹{baseFare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center space-x-1">
                    <span>Taxes & Fees</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{taxesAndFees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Convenience Fee</span>
                  <span className="font-semibold text-gray-900">
                    ₹{convenienceFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {seatCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Seat Selection</span>
                    <span className="font-semibold text-gray-900">₹{seatCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {mealCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Meal</span>
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

              <div className="pt-3 border-t border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-[#FF5722]">Total Payable</span>
                  <span className="text-xl font-black text-[#FF5722]">
                    ₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-start space-x-1.5 text-[11px] text-gray-500 pt-1">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                  <span>Fare is subject to airline rules and may change due to availability, fare conditions or other applicable charges.</span>
                </div>
              </div>
            </div>

            {/* Discounts / Offers */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-sm font-extrabold text-gray-900">
                <span className="text-base text-[#FF5722]">🏷</span>
                <span>Discounts / Offers</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>No offers applied.</span>
                <button type="button" className="text-[#FF5722] font-semibold hover:underline text-xs cursor-pointer">
                  Add promo code &gt;
                </button>
              </div>
            </div>

            {/* Mumbai Plan Promo Card */}
            <div className="rounded-2xl overflow-hidden border border-orange-100 shadow-sm">
              <div
                className="relative h-36 flex flex-col justify-end p-4"
                style={{
                  background: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 50%, #FFCCBC 100%)'
                }}
              >
                <div className="absolute top-3 right-3 text-5xl opacity-30">✈️</div>
                <div className="relative z-10">
                  <div className="text-white font-black text-base leading-tight">
                    Plan Your<br />Next Trip<br />with <span className="text-yellow-200">Flyhigh</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4">
                <p className="text-xs text-gray-600 mb-3">
                  Great fares, flexible options and a smooth booking experience.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-black text-gray-700">Fly<span className="text-[#FF5722]">high</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#FF5722] cursor-pointer">Help & Support</span>
            <span className="text-gray-300">|</span>
            <span className="hover:text-[#FF5722] cursor-pointer">Terms & Conditions</span>
            <span className="text-gray-300">|</span>
            <span className="hover:text-[#FF5722] cursor-pointer">Privacy Policy</span>
          </div>
          <span>© 2026 Flyhigh. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 min-w-[110px] shrink-0">{label}</span>
      <span className="text-xs text-gray-300 mx-1">:</span>
      <span className="text-xs font-medium text-gray-800 break-all">{value}</span>
    </div>
  );
}
