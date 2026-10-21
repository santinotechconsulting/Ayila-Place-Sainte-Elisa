import React, { useState } from 'react';
import { Vendor } from '../types';
import { useMarketplace } from '../services/store';
import { formatXAF, isValidCameroonPhone } from '../utils/formatters';
import { X, Calendar, MapPin, Users, DollarSign, MessageSquare, CheckCircle, Phone } from 'lucide-react';

interface InquiryModalProps {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ vendor, isOpen, onClose, onSuccess }) => {
  const { currentUser, submitInquiry } = useMarketplace();

  const [eventType, setEventType] = useState('Religious Wedding & Reception');
  const [eventDate, setEventDate] = useState('2026-12-19');
  const [eventLocation, setEventLocation] = useState('Douala - Bonanjo / Yassa');
  const [guestCount, setGuestCount] = useState<number>(300);
  const [budgetMin, setBudgetMin] = useState<number>(vendor.startingPriceXaf || 500000);
  const [budgetMax, setBudgetMax] = useState<number>((vendor.startingPriceXaf || 500000) * 2);
  const [requirements, setRequirements] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [clientName, setClientName] = useState(currentUser.fullName);
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '+237 699 00 00 00');
  const [clientEmail, setClientEmail] = useState(currentUser.email);

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    if (!isValidCameroonPhone(clientPhone)) {
      setErrorMsg('Please enter a valid Cameroon phone number (+237 6XX XX XX XX).');
      return;
    }

    submitInquiry({
      customerUserId: currentUser.id,
      customerName: clientName,
      customerEmail: clientEmail,
      customerPhone: clientPhone,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      budgetMinXaf: Number(budgetMin),
      budgetMaxXaf: Number(budgetMax),
      requirements: requirements || 'Initial quote request for our upcoming wedding event.',
      preferredContact,
    });

    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#4D0E1B] text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-amber-200">
              Free Customized Quote Request
            </div>
            <h2 className="font-serif-display text-xl font-bold line-clamp-1">
              {vendor.businessName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900">
              Inquiry Dispatched Successfully!
            </h3>
            <p className="text-sm text-stone-600 max-w-md leading-relaxed">
              Your inquiry has been logged and sent to <strong>{vendor.businessName}</strong>. You will receive a tailored proposal and in-app notification within 24 to 48 hours.
            </p>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] rounded-lg hover:bg-[#9C2239] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-stone-800">
            {errorMsg && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Event details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                >
                  <option value="Religious Wedding & Reception">Religious Wedding & Reception</option>
                  <option value="Civil Registry Ceremony">Civil Registry Ceremony (Town Hall)</option>
                  <option value="Traditional Wedding (Dowry)">Traditional Wedding (Cultural Dowry)</option>
                  <option value="Milestone Anniversary">Milestone Anniversary</option>
                  <option value="Corporate Gala & Banquet">Corporate Gala & Banquet</option>
                  <option value="Other Celebration">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Event Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Event Location / Neighborhood in Douala *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Douala - Bonanjo, Akwa, Yassa..."
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Estimated Guest Count
                </label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                />
              </div>
            </div>

            {/* Budget Range (FCFA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Min Budget (FCFA)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Max Budget (FCFA)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                />
              </div>
            </div>

            {/* Requirements message */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Specific Wishes & Requirements
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Specify your wedding vision (color palette, timelines, sound requirements, dietary needs)..."
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
              />
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-800 mb-2">
                Your Contact Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">
                    Full Name / Couple *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">
                    Cameroon Phone (+237) *
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+237 699 00 00 00"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Preferred Contact Channel
                </label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="whatsapp"
                      checked={preferredContact === 'whatsapp'}
                      onChange={() => setPreferredContact('whatsapp')}
                    />
                    <span className="text-emerald-700 font-medium">WhatsApp</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="phone"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                    />
                    <span>Phone Call</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="email"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                    />
                    <span>Email</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Submit Free Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
