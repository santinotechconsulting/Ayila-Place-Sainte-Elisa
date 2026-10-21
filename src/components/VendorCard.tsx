import React from 'react';
import { Vendor } from '../types';
import { useMarketplace } from '../services/store';
import { formatXAF } from '../utils/formatters';
import { Heart, Star, CheckCircle2, MapPin, ArrowRight, Scale } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
  onSelect: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onSelect }) => {
  const {
    lang,
    categories,
    isFavorite,
    toggleFavorite,
    comparisonVendorIds,
    addToComparison,
    removeFromComparison,
  } = useMarketplace();

  const isFav = isFavorite(vendor.id);
  const isInCompare = comparisonVendorIds.includes(vendor.id);
  const category = categories.find(c => c.id === vendor.primaryCategoryId);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromComparison(vendor.id);
    } else {
      const added = addToComparison(vendor.id);
      if (!added) {
        alert('You can compare up to 4 vendors maximum.');
      }
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(vendor.id);
  };

  return (
    <div
      onClick={() => onSelect(vendor)}
      className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Visual media banner */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={vendor.bannerUrl}
          alt={vendor.businessName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Measured dark scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top actions: Favorite and Compare toggles */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isInCompare
                ? 'bg-amber-400 text-stone-900 shadow-md'
                : 'bg-white/80 hover:bg-white text-stone-700'
            }`}
            title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFav
                ? 'bg-[#801B2E] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-stone-700'
            }`}
            title="Save favorite"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-white' : ''}`} />
          </button>
        </div>

        {/* Verification seal and neighborhood on bottom overlay of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{vendor.neighborhood}, {vendor.city}</span>
          </div>

          {vendor.verificationStatus === 'verified' && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-200 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Audited</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content & Zero-Pill Typography */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata line */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-medium text-[#801B2E] uppercase tracking-wider text-[11px]">
              {category ? (lang === 'fr' ? category.nameFr : category.nameEn) : (lang === 'fr' ? 'Prestataire' : 'Vendor')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-mono tabular-nums">{vendor.rating.toFixed(1)}</span>
              <span className="font-normal text-stone-500 text-[11px]">({vendor.reviewCount})</span>
            </span>
            {vendor.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-semibold text-[11px]">
                  {lang === 'fr' ? 'À la Une' : 'Featured'}
                </span>
              </>
            )}
          </div>

          {/* Primary Business Title */}
          <h3 className="font-serif-display text-lg font-bold text-stone-900 group-hover:text-[#801B2E] transition-colors leading-snug line-clamp-1 mb-1.5">
            {vendor.businessName}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {vendor.tagline || vendor.description}
          </p>
        </div>

        {/* Pricing & CTA Baseline */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wide">
              {vendor.pricingType === 'request_quote' 
                ? (lang === 'fr' ? 'Sur devis' : 'Quote on request') 
                : (lang === 'fr' ? 'À partir de' : 'Starting from')}
            </div>
            <div className="font-mono tabular-nums text-base font-bold text-[#4D0E1B]">
              {vendor.pricingType === 'request_quote' ? (
                <span className="text-xs font-medium text-stone-700">
                  {lang === 'fr' ? 'Devis Sur Mesure' : 'Custom Quote'}
                </span>
              ) : (
                formatXAF(vendor.startingPriceXaf)
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-[#801B2E] group-hover:translate-x-0.5 transition-transform">
            <span>{lang === 'fr' ? 'Voir Profil' : 'View Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
