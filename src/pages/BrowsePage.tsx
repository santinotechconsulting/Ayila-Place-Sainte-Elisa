import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../services/store';
import { VendorCard } from '../components/VendorCard';
import { Vendor } from '../types';
import { formatXAF } from '../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const {
    lang,
    vendors,
    categories,
    setCurrentView,
    setSelectedVendorSlug,
    searchParams,
    setSearchParams,
    resetSearch,
  } = useMarketplace();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter vendors based on active criteria
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Category filter
      if (searchParams.category && vendor.primaryCategoryId !== searchParams.category) {
        return false;
      }

      // Neighborhood / City filter
      if (searchParams.neighborhood) {
        const matchesNeighborhood =
          vendor.neighborhood.toLowerCase().includes(searchParams.neighborhood.toLowerCase()) ||
          vendor.serviceAreas.some(area => area.toLowerCase().includes(searchParams.neighborhood.toLowerCase())) ||
          vendor.city.toLowerCase().includes(searchParams.neighborhood.toLowerCase());
        if (!matchesNeighborhood) return false;
      }

      // Verified filter
      if (searchParams.verifiedOnly && vendor.verificationStatus !== 'verified') {
        return false;
      }

      // Budget max filter
      if (searchParams.budgetMax && vendor.startingPriceXaf > searchParams.budgetMax) {
        return false;
      }

      // Date availability
      if (searchParams.date && vendor.unavailableDates.includes(searchParams.date)) {
        return false;
      }

      // Text query
      if (searchParams.query.trim()) {
        const q = searchParams.query.toLowerCase();
        const matchesQuery =
          vendor.businessName.toLowerCase().includes(q) ||
          vendor.description.toLowerCase().includes(q) ||
          vendor.tagline.toLowerCase().includes(q) ||
          vendor.neighborhood.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      if (searchParams.sortBy === 'price_asc') {
        return a.startingPriceXaf - b.startingPriceXaf;
      }
      if (searchParams.sortBy === 'price_desc') {
        return b.startingPriceXaf - a.startingPriceXaf;
      }
      if (searchParams.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // Default: relevance (featured first, then rating)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [vendors, searchParams]);

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendorSlug(vendor.slug);
    setCurrentView('vendor_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const neighborhoodsList = [
    'Bonanjo',
    'Akwa',
    'Bonapriso',
    'Makepe',
    'Denver',
    'Yassa',
    'Bali',
    'Kotto',
    'Deido',
    'Bonamoussadi',
    'Yaoundé',
    'Kribi',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Query Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
            Wedding & Event Vendors in Cameroon
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Discover, filter, and compare certified professionals and venues in Douala.
          </p>
        </div>

        {/* Search bar & quick filters toggle for mobile */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchParams.query}
              onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search by vendor name or specialty..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2 bg-white border border-stone-300 rounded-lg text-stone-700 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-xl border border-stone-200 self-start sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-semibold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#801B2E]" />
              <span>Filter Options</span>
            </span>
            <button
              onClick={resetSearch}
              className="text-[11px] text-stone-500 hover:text-[#801B2E] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Service Category
            </label>
            <select
              value={searchParams.category}
              onChange={(e) => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
            >
              <option value="">{lang === 'fr' ? 'Toutes les catégories' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === 'fr' ? c.nameFr : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Neighborhood / Area in Douala
            </label>
            <select
              value={searchParams.neighborhood}
              onChange={(e) => setSearchParams(prev => ({ ...prev, neighborhood: e.target.value }))}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
            >
              <option value="">All Neighborhoods</option>
              {neighborhoodsList.map((nh) => (
                <option key={nh} value={nh}>
                  {nh}
                </option>
              ))}
            </select>
          </div>

          {/* Event Date Availability */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Event Date Availability
            </label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E]"
            />
            {searchParams.date && (
              <span className="text-[10px] text-stone-500 mt-1 block">
                Showing vendors confirmed available on this date
              </span>
            )}
          </div>

          {/* Budget Max Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Max Budget
              </label>
              <span className="text-xs font-mono tabular-nums font-bold text-[#801B2E]">
                {formatXAF(searchParams.budgetMax)}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="3000000"
              step="100000"
              value={searchParams.budgetMax}
              onChange={(e) => setSearchParams(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
              className="w-full accent-[#801B2E] cursor-pointer"
            />
          </div>

          {/* Verified Only Checkbox */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.verifiedOnly}
                onChange={(e) => setSearchParams(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="w-4 h-4 accent-[#801B2E] rounded"
              />
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified & Audited Only</span>
              </span>
            </label>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results count & Sort Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-stone-600 font-medium">
              <span className="font-mono tabular-nums font-bold text-stone-900">
                {filteredVendors.length}
              </span>{' '}
              vendor(s) found
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Sort by:</span>
              <select
                value={searchParams.sortBy}
                onChange={(e) => setSearchParams(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#801B2E]"
              >
                <option value="relevance">Relevance & Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Vendors Grid */}
          {filteredVendors.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                No vendors match your search criteria
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Try expanding your neighborhood selection or adjusting your budget limits.
              </p>
              <button
                onClick={resetSearch}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} onSelect={handleSelectVendor} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-bold text-stone-900 text-sm">Filter Options</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Service Category</label>
              <select
                value={searchParams.category}
                onChange={(e) => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-stone-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Neighborhood / Area</label>
              <select
                value={searchParams.neighborhood}
                onChange={(e) => setSearchParams(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full p-2 border border-stone-300 rounded-lg"
              >
                <option value="">All Neighborhoods</option>
                {neighborhoodsList.map((nh) => (
                  <option key={nh} value={nh}>{nh}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={resetSearch}
                className="flex-1 py-2 text-stone-600 border border-stone-300 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-white bg-[#801B2E] rounded-lg font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
