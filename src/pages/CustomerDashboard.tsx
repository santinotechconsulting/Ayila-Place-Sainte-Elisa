import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF, formatDate } from '../utils/formatters';
import { Inquiry, Booking } from '../types';
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Heart,
  MessageCircle,
  FileText,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    inquiries,
    bookings,
    vendors,
    favoriteVendorIds,
    confirmBookingFromInquiry,
    toggleFavorite,
    setCurrentView,
    setSelectedVendorSlug,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'bookings' | 'favorites'>('inquiries');
  const [selectedInquiryForQuote, setSelectedInquiryForQuote] = useState<Inquiry | null>(null);

  // Inquiries for current customer
  const myInquiries = inquiries.filter(i => i.customerUserId === currentUser.id);
  const myBookings = bookings.filter(b => b.customerUserId === currentUser.id);
  const myFavorites = vendors.filter(v => favoriteVendorIds.includes(v.id));

  const handleConfirmQuote = (inquiryId: string) => {
    confirmBookingFromInquiry(inquiryId);
    setSelectedInquiryForQuote(null);
    alert('Congratulations! Your wedding booking has been confirmed with the vendor.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Customer Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#801B2E] text-white flex items-center justify-center font-serif-display text-2xl font-bold">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#801B2E] uppercase tracking-wider">
              Client & Couple Portal
            </div>
            <h1 className="font-serif-display text-2xl font-bold text-stone-900">
              {currentUser.fullName}
            </h1>
            <div className="text-xs text-stone-500 font-mono mt-0.5">
              {currentUser.email} · {currentUser.phone}
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Inquiries ({myInquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bookings' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Confirmed Bookings ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'favorites' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Favorites ({myFavorites.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Inquiries Pipeline */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-bold text-stone-900">
              Inquiries & Quote Proposals
            </h2>
            <button
              onClick={() => setCurrentView('browse')}
              className="text-xs font-semibold text-[#801B2E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Contact another vendor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myInquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">
                You have not submitted any quote inquiries yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myInquiries.map((inq) => {
                const vendor = vendors.find(v => v.id === inq.vendorId);
                return (
                  <div
                    key={inq.id}
                    className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-display text-lg font-bold text-stone-900">
                          {inq.vendorName}
                        </span>
                        {inq.status === 'quote_received' && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Quote Received
                          </span>
                        )}
                        {inq.status === 'confirmed' && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Booking Confirmed
                          </span>
                        )}
                        {inq.status === 'new' && (
                          <span className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                            Awaiting Vendor Response
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap items-center gap-4">
                        <span>Event: <strong className="text-stone-800">{inq.eventType}</strong></span>
                        <span>·</span>
                        <span>Date: <strong className="text-stone-800">{formatDate(inq.eventDate, 'en')}</strong></span>
                        <span>·</span>
                        <span>Location: <strong className="text-stone-800">{inq.eventLocation}</strong></span>
                        {inq.guestCount && (
                          <>
                            <span>·</span>
                            <span>Guests: <strong className="text-stone-800">{inq.guestCount}</strong></span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 italic max-w-xl">
                        "{inq.requirements}"
                      </p>
                    </div>

                    {/* Actions depending on status */}
                    <div className="flex items-center gap-3 shrink-0">
                      {inq.quote ? (
                        <button
                          onClick={() => setSelectedInquiryForQuote(inq)}
                          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm cursor-pointer"
                        >
                          Review Received Quote
                        </button>
                      ) : (
                        <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Usual turnaround ~24h</span>
                        </div>
                      )}

                      {vendor && (
                        <button
                          onClick={() => {
                            setSelectedVendorSlug(vendor.slug);
                            setCurrentView('vendor_detail');
                          }}
                          className="px-3 py-2 text-xs text-stone-700 hover:text-stone-900 border border-stone-200 rounded-lg cursor-pointer"
                        >
                          Vendor Profile
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="font-serif-display text-xl font-bold text-stone-900">
            Your Confirmed Bookings
          </h2>

          {myBookings.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">
                No confirmed bookings at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((bk) => {
                const vendor = vendors.find(v => v.id === bk.vendorId);
                return (
                  <div
                    key={bk.id}
                    className="bg-white p-6 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-serif-display text-lg font-bold text-stone-900">
                          {vendor?.businessName || 'Ayila\'a Professional'}
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap items-center gap-4">
                        <span>Event Date: <strong className="text-stone-800">{formatDate(bk.eventDate, 'en')}</strong></span>
                        <span>·</span>
                        <span>Agreed Amount: <strong className="text-[#801B2E] font-mono tabular-nums">{formatXAF(bk.agreedAmountXaf)}</strong></span>
                        <span>·</span>
                        <span>Confirmed on: <span className="font-mono">{formatDate(bk.confirmationTimestamp, 'en')}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {vendor && (
                        <button
                          onClick={() => {
                            const clean = vendor.whatsapp.replace(/[^\d]/g, '');
                            window.open(`https://wa.me/${clean}`, '_blank');
                          }}
                          className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contact Vendor</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h2 className="font-serif-display text-xl font-bold text-stone-900">
            Saved Favorites
          </h2>

          {myFavorites.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">
                You have no saved favorites yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] w-full bg-stone-100 relative">
                    <img
                      src={fav.bannerUrl}
                      alt={fav.businessName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(fav.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-[#801B2E] shadow cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-[11px] text-stone-500">{fav.neighborhood}, {fav.city}</div>
                      <h3 className="font-serif-display font-bold text-stone-900 line-clamp-1">
                        {fav.businessName}
                      </h3>
                      <div className="text-xs font-mono font-bold text-[#801B2E] mt-1">
                        {formatXAF(fav.startingPriceXaf)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVendorSlug(fav.slug);
                        setCurrentView('vendor_detail');
                      }}
                      className="w-full py-2 text-xs font-semibold text-[#801B2E] bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quote Review Modal */}
      {selectedInquiryForQuote && selectedInquiryForQuote.quote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-xs text-stone-800">
            <div className="p-6 bg-[#4D0E1B] text-white">
              <span className="text-[11px] uppercase tracking-wider text-amber-200 font-semibold block">
                Official Formal Proposal
              </span>
              <h3 className="font-serif-display text-xl font-bold">
                {selectedInquiryForQuote.vendorName}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Proposed Amount</span>
                  <span className="font-mono tabular-nums text-xl font-bold text-[#4D0E1B]">
                    {formatXAF(selectedInquiryForQuote.quote.amountXaf)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-stone-500">
                  <span>Offer valid through:</span>
                  <div className="font-semibold text-stone-800 font-mono">
                    {formatDate(selectedInquiryForQuote.quote.validUntil, 'en')}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-900 block mb-1.5">Services included in this quotation:</span>
                <ul className="space-y-1.5 text-stone-600">
                  {selectedInquiryForQuote.quote.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedInquiryForQuote.quote.terms && (
                <div className="p-3 bg-stone-50 rounded-lg text-stone-600 text-[11px]">
                  <strong>Terms & Conditions:</strong> {selectedInquiryForQuote.quote.terms}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  onClick={() => setSelectedInquiryForQuote(null)}
                  className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900"
                >
                  Close
                </button>
                <button
                  onClick={() => handleConfirmQuote(selectedInquiryForQuote.id)}
                  className="px-6 py-2.5 font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Confirm This Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
