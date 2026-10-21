import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF, formatDate } from '../utils/formatters';
import { Inquiry, VendorPackage, VendorPlan } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import {
  Inbox,
  Package,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const {
    currentUser,
    vendors,
    updateVendor,
    inquiries,
    sendQuote,
    vendorPlans,
  } = useMarketplace();

  // Find vendor owned by current user or default to Place Sainte Elisa
  const myVendor = vendors.find(v => v.ownerUserId === currentUser.id) || vendors[0];

  const [activeTab, setActiveTab] = useState<'inbound_leads' | 'packages' | 'calendar' | 'subscription'>('inbound_leads');

  // Quote modal
  const [activeInquiryForQuote, setActiveInquiryForQuote] = useState<Inquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(1450000);
  const [quoteInclusions, setQuoteInclusions] = useState('Air-conditioned 600-capacity ballroom\nLandscaped cocktail gardens\nHeavy industrial 150 kVA generator\nGuarded parking security\nPrivate bridal suite');
  const [quoteTerms, setQuoteTerms] = useState('40% deposit for confirmed reservation. Balance due 14 days prior to wedding.');
  const [quoteValidDate, setQuoteValidDate] = useState('2026-11-15');

  // Add package modal
  const [addPkgModalOpen, setAddPkgModalOpen] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(500000);
  const [newPkgInclusions, setNewPkgInclusions] = useState('');

  // Add unavailable date
  const [newUnavailableDate, setNewUnavailableDate] = useState('');

  // Payment modal for subscription upgrade
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<VendorPlan | null>(null);

  // Filter inquiries for this vendor
  const vendorInquiries = inquiries.filter(i => i.vendorId === myVendor.id);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForQuote) return;

    sendQuote(activeInquiryForQuote.id, {
      vendorId: myVendor.id,
      amountXaf: Number(quoteAmount),
      inclusions: quoteInclusions.split('\n').filter(s => s.trim().length > 0),
      exclusions: ['External accommodation charges'],
      terms: quoteTerms,
      validUntil: quoteValidDate,
    });

    setActiveInquiryForQuote(null);
    alert('Quote proposal sent successfully to client!');
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;

    const newPkg: VendorPackage = {
      id: `pkg-${Date.now()}`,
      vendorId: myVendor.id,
      name: newPkgName,
      description: newPkgDesc,
      priceXaf: Number(newPkgPrice),
      inclusions: newPkgInclusions.split('\n').filter(s => s.trim().length > 0),
      exclusions: [],
      active: true,
    };

    updateVendor(myVendor.id, {
      packages: [...myVendor.packages, newPkg],
    });

    setNewPkgName('');
    setNewPkgDesc('');
    setNewPkgInclusions('');
    setAddPkgModalOpen(false);
  };

  const handleAddUnavailableDate = () => {
    if (!newUnavailableDate) return;
    if (myVendor.unavailableDates.includes(newUnavailableDate)) return;

    updateVendor(myVendor.id, {
      unavailableDates: [...myVendor.unavailableDates, newUnavailableDate],
    });
    setNewUnavailableDate('');
  };

  const handleRemoveUnavailableDate = (dateStr: string) => {
    updateVendor(myVendor.id, {
      unavailableDates: myVendor.unavailableDates.filter(d => d !== dateStr),
    });
  };

  const currentPlan = vendorPlans.find(p => p.id === myVendor.planId) || vendorPlans[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Vendor Top Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={myVendor.logoUrl}
            alt={myVendor.businessName}
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-display text-2xl font-bold text-stone-900">
                {myVendor.businessName}
              </h1>
              {myVendor.verificationStatus === 'verified' && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Audited</span>
                </span>
              )}
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-3 mt-1">
              <span>{myVendor.neighborhood}, {myVendor.city}</span>
              <span>·</span>
              <span className="text-amber-800 font-semibold uppercase tracking-wider text-[11px]">
                Plan: {currentPlan.nameEn}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-6 text-center text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase">Inquiries</span>
            <span className="font-mono tabular-nums text-lg font-bold text-stone-900">
              {vendorInquiries.length}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase">Client Rating</span>
            <span className="font-mono tabular-nums text-lg font-bold text-amber-600">
              {myVendor.rating.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase">Active Packages</span>
            <span className="font-mono tabular-nums text-lg font-bold text-[#801B2E]">
              {myVendor.packages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('inbound_leads')}
          className={`px-4 py-2.5 font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'inbound_leads'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbound Leads & Quotes ({vendorInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'packages'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Turnkey Packages ({myVendor.packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'calendar'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Availability & Blocked Dates</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2.5 font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'subscription'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Membership & Visibility</span>
        </button>
      </div>

      {/* Tab 1: Inbound Leads & Quotes Management */}
      {activeTab === 'inbound_leads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-bold text-stone-900">
              Customer Quote Requests
            </h2>
            <div className="text-xs text-stone-500">
              Respond within 24 hours to maximize your booking conversion rate.
            </div>
          </div>

          {vendorInquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">
                No new customer requests at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-serif-display text-lg font-bold text-stone-900">
                        {inq.customerName}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        Budget: {formatXAF(inq.budgetMinXaf)} - {formatXAF(inq.budgetMaxXaf)}
                      </span>
                      {inq.status === 'confirmed' && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Booking Confirmed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap items-center gap-3">
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

                    <div className="text-xs text-stone-700 bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/70 max-w-2xl">
                      <span className="font-semibold block text-[11px] text-stone-500 mb-0.5">Event Requirements:</span>
                      "{inq.requirements}"
                    </div>

                    <div className="text-xs text-stone-600 flex items-center gap-4 pt-1">
                      <span>Phone: <strong className="font-mono text-stone-900">{inq.customerPhone}</strong></span>
                      <span>·</span>
                      <span>Email: <strong className="text-stone-900">{inq.customerEmail}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        const clean = inq.customerPhone.replace(/[^\d]/g, '');
                        window.open(`https://wa.me/${clean}?text=Hello%20${encodeURIComponent(inq.customerName)},%20I%20have%20received%20your%20inquiry%20on%20Ayila'a.`, '_blank');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      WhatsApp Client
                    </button>

                    <button
                      onClick={() => {
                        setActiveInquiryForQuote(inq);
                        setQuoteAmount(inq.budgetMinXaf || 1000000);
                      }}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      {inq.quote ? 'Edit Sent Quote' : 'Send Itemized Quote'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Packages & Inclusions */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-stone-900">
                Your Published Turnkey Packages
              </h2>
              <p className="text-xs text-stone-500">
                Couples in Douala strongly favor packages with transparent inclusions.
              </p>
            </div>

            <button
              onClick={() => setAddPkgModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myVendor.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif-display text-lg font-bold text-stone-900">
                      {pkg.name}
                    </h3>
                    <span className="font-mono tabular-nums text-base font-bold text-[#801B2E]">
                      {formatXAF(pkg.priceXaf)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mb-4">{pkg.description}</p>

                  <div className="space-y-1.5 text-xs text-stone-700">
                    <span className="font-semibold block text-[11px] text-stone-500 uppercase">
                      Included Services:
                    </span>
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Status: <strong className="text-emerald-700">Active</strong></span>
                  <button
                    onClick={() => {
                      updateVendor(myVendor.id, {
                        packages: myVendor.packages.filter(p => p.id !== pkg.id),
                      });
                    }}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    Delete Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif-display text-xl font-bold text-stone-900">
              Manage Blackout & Booked Dates
            </h2>
            <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
              Prevent double bookings by locking dates where your venue or teams are already committed.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <input
                type="date"
                value={newUnavailableDate}
                onChange={(e) => setNewUnavailableDate(e.target.value)}
                className="text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
              />
              <button
                onClick={handleAddUnavailableDate}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors cursor-pointer"
              >
                Block This Date
              </button>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-800 block mb-3">
                Dates currently marked unavailable for {myVendor.businessName}:
              </span>
              <div className="flex flex-wrap gap-2">
                {myVendor.unavailableDates.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-mono px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg flex items-center gap-2 border border-stone-200"
                  >
                    <span>{formatDate(d, 'en')}</span>
                    <button
                      onClick={() => handleRemoveUnavailableDate(d)}
                      className="text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Subscription & Monetization */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                  Current Visibility Status
                </span>
                <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
                  {currentPlan.nameEn} Plan
                </h2>
                <div className="text-xs text-stone-500 font-mono mt-1">
                  {formatXAF(currentPlan.priceXaf)} / month
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Active Vendor · Douala
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Upgrade Visibility with Ayila'a Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vendorPlans.filter(p => p.id !== 'free').map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                      myVendor.planId === plan.id
                        ? 'border-[#801B2E] bg-[#FAF8F5] ring-2 ring-[#801B2E]'
                        : 'border-stone-200 bg-white hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif-display text-lg font-bold text-stone-900">
                        {plan.nameEn}
                      </h4>
                      <div className="font-mono tabular-nums text-xl font-bold text-[#801B2E] my-2">
                        {formatXAF(plan.priceXaf)} <span className="text-xs text-stone-500 font-normal">/ month</span>
                      </div>
                      <p className="text-xs text-stone-600 mb-4">
                        {plan.descriptionEn}
                      </p>

                      <ul className="space-y-1.5 text-xs text-stone-700 mb-6">
                        {plan.featuresEn.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlanForUpgrade(plan);
                        setPaymentModalOpen(true);
                      }}
                      disabled={myVendor.planId === plan.id}
                      className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        myVendor.planId === plan.id
                          ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                          : 'bg-[#801B2E] text-white hover:bg-[#9C2239]'
                      }`}
                    >
                      {myVendor.planId === plan.id ? 'Current Plan' : 'Activate via Mobile Money'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote creation modal */}
      {activeInquiryForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-xs text-stone-800">
            <div className="p-6 bg-[#4D0E1B] text-white">
              <span className="text-[11px] text-amber-200 uppercase tracking-wider font-semibold block">
                Issue Formal Wedding Quotation
              </span>
              <h3 className="font-serif-display text-xl font-bold">
                For {activeInquiryForQuote.customerName}
              </h3>
            </div>

            <form onSubmit={handleSendQuote} className="p-6 space-y-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Total Quoted Amount (FCFA) *
                </label>
                <input
                  type="number"
                  step="50000"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono tabular-nums font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Included Services & Inclusions (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={quoteInclusions}
                  onChange={(e) => setQuoteInclusions(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Deposit & Payment Terms
                  </label>
                  <input
                    type="text"
                    value={quoteTerms}
                    onChange={(e) => setQuoteTerms(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Offer Valid Until
                  </label>
                  <input
                    type="date"
                    value={quoteValidDate}
                    onChange={(e) => setQuoteValidDate(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setActiveInquiryForQuote(null)}
                  className="px-4 py-2 text-stone-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg shadow-sm"
                >
                  Transmit Quote to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add package modal */}
      {addPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-xs text-stone-800">
            <div className="p-6 bg-[#4D0E1B] text-white">
              <h3 className="font-serif-display text-xl font-bold">
                Publish a New Turnkey Package
              </h3>
            </div>

            <form onSubmit={handleAddPackage} className="p-6 space-y-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Fairytale Wedding Package"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Price (FCFA) *</label>
                <input
                  type="number"
                  step="50000"
                  value={newPkgPrice}
                  onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Summary Description</label>
                <input
                  type="text"
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg"
                  placeholder="Concise overview of what this formula provides"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Inclusions (1 per line)</label>
                <textarea
                  rows={4}
                  value={newPkgInclusions}
                  onChange={(e) => setNewPkgInclusions(e.target.value)}
                  placeholder="e.g. Complete ballroom setup&#10;Full sound and moving head lights&#10;On-site day-of coordinator"
                  className="w-full p-2.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAddPkgModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal for subscription */}
      {selectedPlanForUpgrade && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amountXaf={selectedPlanForUpgrade.priceXaf}
          purpose="subscription"
          title={`Membership: ${selectedPlanForUpgrade.nameEn}`}
          vendorId={myVendor.id}
          planId={selectedPlanForUpgrade.id}
        />
      )}
    </div>
  );
};
