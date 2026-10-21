import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF } from '../utils/formatters';
import { Vendor } from '../types';
import { InquiryModal } from '../components/InquiryModal';
import {
  Scale,
  X,
  Star,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const {
    vendors,
    categories,
    comparisonVendorIds,
    removeFromComparison,
    clearComparison,
    setCurrentView,
    setSelectedVendorSlug,
  } = useMarketplace();

  const [activeInquiryVendor, setActiveInquiryVendor] = useState<Vendor | null>(null);

  const comparedVendors = vendors.filter(v => comparisonVendorIds.includes(v.id));

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendorSlug(vendor.slug);
    setCurrentView('vendor_detail');
  };

  if (comparedVendors.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-[#801B2E] rounded-full flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
          Your Comparison List is Currently Empty
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Select up to 4 vendors from the directory to compare their packages, starting prices in FCFA, capacity, and booking requirements side by side.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('browse')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors cursor-pointer"
          >
            Browse Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#801B2E] uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Comparison Matrix</span>
          </div>
          <h1 className="font-serif-display text-3xl font-bold text-stone-900">
            Compare Selected Vendors
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            {comparedVendors.length} / 4 vendors selected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearComparison}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-red-700 transition-colors border border-stone-200 rounded-lg cursor-pointer"
          >
            Clear Comparison
          </button>

          {comparedVendors.length < 4 && (
            <button
              onClick={() => setCurrentView('browse')}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Vendor</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="p-4 w-44 font-semibold text-stone-500 uppercase tracking-wider text-[11px] sticky left-0 bg-stone-50 z-10">
                Evaluation Criteria
              </th>
              {comparedVendors.map((vendor) => (
                <th key={vendor.id} className="p-4 min-w-[240px] max-w-[280px] align-top">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-serif-display text-base font-bold text-stone-900 line-clamp-1">
                      {vendor.businessName}
                    </span>
                    <button
                      onClick={() => removeFromComparison(vendor.id)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded-full"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={vendor.bannerUrl}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setActiveInquiryVendor(vendor)}
                    className="w-full py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors text-center cursor-pointer"
                  >
                    Request a Quote
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {/* Category */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Category</td>
              {comparedVendors.map((v) => {
                const cat = categories.find(c => c.id === v.primaryCategoryId);
                return (
                  <td key={v.id} className="p-4 text-stone-800 font-medium">
                    {cat ? cat.nameEn : 'Vendor'}
                  </td>
                );
              })}
            </tr>

            {/* Starting Price in XAF */}
            <tr className="bg-amber-50/20">
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Starting Price (FCFA)</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4 font-mono tabular-nums text-base font-bold text-[#4D0E1B]">
                  {formatXAF(v.startingPriceXaf)}
                </td>
              ))}
            </tr>

            {/* Location & Neighborhood */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Neighborhood & City</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4 text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{v.neighborhood}, {v.city}</span>
                </td>
              ))}
            </tr>

            {/* Verification & Audit */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Audit Status</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4">
                  {v.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Audited & Verified</span>
                    </span>
                  ) : (
                    <span className="text-stone-500 text-xs">Pending verification</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Ratings & Reviews */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Client Rating</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-mono font-bold text-stone-900">{v.rating.toFixed(2)}</span>
                    <span className="text-stone-500 text-[11px]">({v.reviewCount} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Available Packages Count */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Turnkey Packages</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4 text-stone-800 font-medium">
                  {v.packages.length} package(s) published
                </td>
              ))}
            </tr>

            {/* Booking Requirements */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Deposit & Payment Terms</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4 text-stone-600 text-xs leading-relaxed">
                  {v.bookingRequirements}
                </td>
              ))}
            </tr>

            {/* Response Time */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Avg. Response Time</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4 text-stone-600 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>~{v.responseTimeHours}h</span>
                </td>
              ))}
            </tr>

            {/* Direct Profile Link */}
            <tr>
              <td className="p-4 font-semibold text-stone-700 bg-stone-50/30 sticky left-0">Full Profile</td>
              {comparedVendors.map((v) => (
                <td key={v.id} className="p-4">
                  <button
                    onClick={() => handleSelectVendor(v)}
                    className="text-xs font-semibold text-[#801B2E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View full rate card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {activeInquiryVendor && (
        <InquiryModal
          vendor={activeInquiryVendor}
          isOpen={!!activeInquiryVendor}
          onClose={() => setActiveInquiryVendor(null)}
        />
      )}
    </div>
  );
};
