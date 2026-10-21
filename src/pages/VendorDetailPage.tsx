import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { Vendor, VendorPackage } from '../types';
import { formatXAF, formatDate } from '../utils/formatters';
import { InquiryModal } from '../components/InquiryModal';
import {
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Calendar,
  ShieldCheck,
  Scale,
  Heart,
  ChevronRight,
  Info,
  Check,
  X,
} from 'lucide-react';

export const VendorDetailPage: React.FC = () => {
  const {
    vendors,
    categories,
    selectedVendorSlug,
    setCurrentView,
    setSelectedVendorSlug,
    currentUser,
    addReview,
    getReviewsByVendorId,
    isFavorite,
    toggleFavorite,
    comparisonVendorIds,
    addToComparison,
    removeFromComparison,
  } = useMarketplace();

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<VendorPackage | null>(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Active portfolio gallery modal
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  const vendor = vendors.find(v => v.slug === selectedVendorSlug) || vendors[0];
  const category = categories.find(c => c.id === vendor.primaryCategoryId);
  const vendorReviews = getReviewsByVendorId(vendor.id);
  const isFav = isFavorite(vendor.id);
  const isInCompare = comparisonVendorIds.includes(vendor.id);

  const similarVendors = vendors
    .filter(v => v.id !== vendor.id && (v.primaryCategoryId === vendor.primaryCategoryId || v.neighborhood === vendor.neighborhood))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Vendor profile link copied to clipboard!');
    }
  };

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeFromComparison(vendor.id);
    } else {
      const added = addToComparison(vendor.id);
      if (!added) {
        alert('Comparison limit of 4 vendors reached.');
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    addReview({
      customerUserId: currentUser.id,
      customerName: currentUser.fullName,
      vendorId: vendor.id,
      rating: newRating,
      reviewText: newReviewText,
    });

    setNewReviewText('');
    setReviewSubmitted(true);
  };

  const openWhatsApp = () => {
    const cleanPhone = vendor.whatsapp.replace(/[^\d]/g, '');
    const text = encodeURIComponent(
      `Hello ${vendor.businessName}, I am contacting you from Ayila'a | Place Sainte Elisa regarding an upcoming event inquiry.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={() => { setCurrentView('home'); setSelectedVendorSlug(null); }}
          className="hover:text-stone-900 cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => { setCurrentView('browse'); setSelectedVendorSlug(null); }}
          className="hover:text-stone-900 cursor-pointer"
        >
          Browse Vendors
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-medium truncate max-w-xs">{vendor.businessName}</span>
      </nav>

      {/* Hero Presentation Header */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Cover image banner */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-stone-900">
          <img
            src={vendor.bannerUrl}
            alt={vendor.businessName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top overlay actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleCompareToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                isInCompare
                  ? 'bg-amber-400 text-stone-900 font-bold'
                  : 'bg-white/80 hover:bg-white text-stone-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isInCompare ? 'Remove from Compare' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(vendor.id)}
              className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                isFav ? 'bg-[#801B2E] text-white' : 'bg-white/80 hover:bg-white text-stone-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white/80 hover:bg-white text-stone-800 backdrop-blur-md transition-colors cursor-pointer"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Banner Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-amber-200 mb-2">
                <span className="uppercase tracking-wider font-semibold">
                  {category ? category.nameEn : 'Vendor'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>{vendor.neighborhood}, {vendor.city}</span>
                </span>
                {vendor.verificationStatus === 'verified' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified & Audited</span>
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                {vendor.businessName}
              </h1>
              {vendor.tagline && (
                <p className="text-xs sm:text-sm text-stone-200 font-light mt-1 max-w-2xl drop-shadow">
                  {vendor.tagline}
                </p>
              )}
            </div>

            {/* Quick Pricing Badge */}
            <div className="bg-white/90 backdrop-blur-md text-stone-900 px-4 py-3 rounded-xl border border-stone-200 shrink-0 text-left sm:text-right">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                {vendor.pricingType === 'request_quote' ? 'Quote on request' : 'Starting from'}
              </span>
              <span className="font-mono tabular-nums text-xl font-bold text-[#4D0E1B]">
                {vendor.pricingType === 'request_quote' ? 'Custom Quote' : formatXAF(vendor.startingPriceXaf)}
              </span>
            </div>
          </div>
        </div>

        {/* Action strip bar */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                {vendor.rating.toFixed(2)}
              </span>
              <span>({vendor.reviewCount} verified reviews)</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Average response time: ~{vendor.responseTimeHours}h</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openWhatsApp}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp</span>
            </button>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Request Free Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 columns: Details left, Purchase/Contact sticky right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-10">
          {/* 1. About the business */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-4">
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              About This Vendor
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line font-light">
              {vendor.description}
            </p>

            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-stone-900 block mb-1">Service Areas:</span>
                <span className="text-stone-600">{vendor.serviceAreas.join(' · ')}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-900 block mb-1">Booking Terms & Deposits:</span>
                <span className="text-stone-600">{vendor.bookingRequirements}</span>
              </div>
            </div>
          </section>

          {/* 2. Detailed Packages & Inclusions */}
          {vendor.packages && vendor.packages.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Turnkey Packages & Formulas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {vendor.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between hover:border-amber-400 transition-colors shadow-sm"
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
                      <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                          Included In This Package:
                        </span>
                        <ul className="space-y-1.5 text-xs text-stone-600">
                          {pkg.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {pkg.exclusions && pkg.exclusions.length > 0 && (
                        <div className="space-y-1.5 mb-4 text-[11px] text-stone-500">
                          <span className="font-medium">Not Included:</span>
                          <span className="ml-1">{pkg.exclusions.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setInquiryModalOpen(true);
                      }}
                      className="w-full mt-4 py-2.5 text-xs font-semibold text-[#801B2E] bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Select This Package
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Portfolio & Real Gallery */}
          {vendor.portfolio && vendor.portfolio.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Portfolio & Recent Celebrations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendor.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMediaUrl(item.mediaUrl)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 cursor-pointer border border-stone-200"
                  >
                    <img
                      src={item.mediaUrl}
                      alt={item.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs text-white drop-shadow">{item.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Availability Calendar Notice */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#801B2E]" />
              <h2 className="font-serif-display text-xl font-bold text-stone-900">
                Availability Calendar
              </h2>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dates currently confirmed booked for high-season weekend celebrations in Douala:
            </p>

            {vendor.unavailableDates && vendor.unavailableDates.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {vendor.unavailableDates.map((dateStr) => (
                  <span
                    key={dateStr}
                    className="text-xs font-mono px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-1.5"
                  >
                    <X className="w-3 h-3" />
                    <span>{formatDate(dateStr, 'en')} (Booked)</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                Open availability for the upcoming wedding season. Inquire now to secure your date.
              </div>
            )}
          </section>

          {/* 5. Verified Client Reviews */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Verified Client Reviews ({vendorReviews.length})
              </h2>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="font-mono tabular-nums">{vendor.rating.toFixed(2)} / 5</span>
              </div>
            </div>

            {/* Existing reviews */}
            <div className="space-y-4">
              {vendorReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">{rev.customerName}</span>
                      {rev.verified && (
                        <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          Verified Wedding
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {formatDate(rev.createdAt, 'en')}
                    </span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    {rev.reviewText}
                  </p>
                </div>
              ))}
            </div>

            {/* Leave a review form */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Submit a Verified Review
              </h3>
              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
                  Thank you! Your verified review has been published on the vendor profile.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Rating:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your experience regarding service quality, reliability, and delivery on the wedding day..."
                      className="w-full text-xs p-3 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors cursor-pointer"
                  >
                    Publish Review
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* Right Sticky Sidebar (1/3 width): Contiguous Purchase & Inquiry Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-lg sticky top-24 space-y-6">
            <div>
              <span className="text-[11px] text-stone-500 uppercase tracking-widest block font-medium">
                {vendor.pricingType === 'request_quote' ? 'Custom Quote' : 'Starting from'}
              </span>
              <div className="font-mono tabular-nums text-2xl font-bold text-[#4D0E1B] mt-1">
                {vendor.pricingType === 'request_quote' ? 'Quote on request' : formatXAF(vendor.startingPriceXaf)}
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                Official pricing in FCFA (Taxes and custom equipment per quote)
              </span>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full py-3 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-200" />
                <span>Request Free Quote</span>
              </button>

              <button
                onClick={openWhatsApp}
                className="w-full py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Direct Telephone */}
            <div className="pt-4 border-t border-stone-100 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="font-mono font-medium">{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{vendor.neighborhood}, {vendor.city}</span>
              </div>
            </div>

            {/* Trust and audit highlights */}
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Registered enterprise with RCCM verification & equipment audits.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#801B2E] shrink-0 mt-0.5" />
                <span>Secure booking with itemized, formal service agreement.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vendors Section */}
      {similarVendors.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Similar Vendors in Douala
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarVendors.map((simVendor) => (
              <div
                key={simVendor.id}
                onClick={() => {
                  setSelectedVendorSlug(simVendor.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md cursor-pointer transition-all"
              >
                <div className="aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={simVendor.bannerUrl}
                    alt={simVendor.businessName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider mb-1">
                    {simVendor.neighborhood}
                  </div>
                  <h3 className="font-serif-display font-bold text-stone-900 line-clamp-1">
                    {simVendor.businessName}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#801B2E] mt-2">
                    {formatXAF(simVendor.startingPriceXaf)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        vendor={vendor}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      {/* Portfolio Expanded Modal */}
      {activeMediaUrl && (
        <div
          onClick={() => setActiveMediaUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <img
            src={activeMediaUrl}
            alt="Expanded Portfolio Showcase"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
