import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { VendorCard } from '../components/VendorCard';
import { Vendor } from '../types';
import { formatXAF } from '../utils/formatters';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Camera,
  Utensils,
  Music,
  Crown,
  Tent,
  ArrowRight,
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    lang,
    t,
    vendors,
    categories,
    setCurrentView,
    setSelectedVendorSlug,
    setSearchParams,
  } = useMarketplace();

  // Local hero search form state
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('all');

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({
      ...prev,
      category: selectedCat,
      neighborhood: selectedNeighborhood,
      date: selectedDate,
      budgetMax: selectedBudget === '500k' ? 500000 : selectedBudget === '1m' ? 1000000 : selectedBudget === '2m' ? 2000000 : 5000000,
    }));
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendorSlug(vendor.slug);
    setCurrentView('vendor_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredVendors = vendors.filter(v => v.featured || v.verificationStatus === 'verified').slice(0, 4);

  const faqs = [
    {
      q: "How are vendors audited and verified on Ayila'a?",
      a: "Our Douala-based team conducts strict verification: business registration (RCCM), physical in-person inspection of facilities/estates (such as Place Sainte Elisa), equipment audits (verifying backup generator power, air conditioning), and review of at least 3 successful past weddings.",
    },
    {
      q: "Is requesting quotes and contacting vendors free for couples?",
      a: "Yes, searching, comparing, and submitting quote inquiries is 100% free for couples, families, and planners. You communicate directly with verified professionals with zero hidden platform markups.",
    },
    {
      q: "Which payment methods are accepted for plans and deposits?",
      a: "We support MTN Mobile Money (*126#) and Orange Money (#150#) throughout Cameroon (+237), as well as local bank transfers (UBA, Afriland First Bank, SG Cameroon) and verified agency payments.",
    },
    {
      q: "Can I privatize Place Sainte Elisa for my wedding celebration?",
      a: "Absolutely. Place Sainte Elisa is available with live availability calendars, turnkey packages for the 600-guest grand reception ballroom, and lush tropical gardens for ceremonies and cocktails.",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section with Luxury Cameroon Visual Banner */}
      <section className="relative min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Cinematic background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_douala_wedding_1792577982339.jpg"
            alt="Prestige Wedding in Douala"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Measured multi-layer gradient scrim for high-contrast legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/75" />
          <div className="absolute inset-0 bg-[#4D0E1B]/30 mix-blend-multiply" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Unboxed subtle editorial kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4">
            <span>Place Sainte Elisa</span>
            <span aria-hidden="true">·</span>
            <span>Douala, Cameroon</span>
            <span aria-hidden="true">·</span>
            <span>Weddings & Grand Events</span>
          </div>

          {/* Hero headline in Cormorant Garamond display serif */}
          <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6 drop-shadow-md">
            {t.heroTitle || 'Plan Your Perfect Event with Trusted Professionals'}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSubtitle || 'Discover, compare, and connect with the best wedding and event vendors in Douala, Cameroon.'}
          </p>

          {/* Cameroon Search Box Component */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl mx-auto border border-stone-200 text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.searchWhat || 'What service do you need?'}
                </label>
                <div className="relative">
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E] text-stone-800"
                  >
                    <option value="">{lang === 'fr' ? 'Toutes les catégories' : 'All Categories'}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'fr' ? c.nameFr : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Douala Neighborhood */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.searchWhere || 'Where is your event?'}
                </label>
                <div className="relative">
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E] text-stone-800"
                  >
                    <option value="">{lang === 'fr' ? 'Tout Douala & Quartiers' : 'All Douala & Areas'}</option>
                    <option value="Bonanjo">Douala - Bonanjo</option>
                    <option value="Akwa">Douala - Akwa</option>
                    <option value="Bonapriso">Douala - Bonapriso</option>
                    <option value="Makepe">Douala - Makepe</option>
                    <option value="Denver">Douala - Denver</option>
                    <option value="Yassa">Douala - Yassa (Sainte Elisa)</option>
                    <option value="Bali">Douala - Bali</option>
                    <option value="Kotto">Douala - Kotto</option>
                    <option value="Yaoundé">Yaoundé (Capital)</option>
                    <option value="Kribi">Kribi (Beachfront)</option>
                  </select>
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.searchDate || 'Event date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E] text-stone-800"
                />
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.searchBudget || 'Estimated budget'}
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E] text-stone-800"
                >
                  <option value="all">{lang === 'fr' ? 'Tous budgets' : 'Any budget'}</option>
                  <option value="500k">&lt; 500,000 FCFA</option>
                  <option value="1m">500,000 - 1,000,000 FCFA</option>
                  <option value="2m">1,000,000 - 2,000,000 FCFA</option>
                  <option value="luxury">&gt; 2,000,000 FCFA ({lang === 'fr' ? 'Prestige' : 'Luxury'})</option>
                </select>
              </div>
            </form>

            {/* Actions row */}
            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'fr' 
                    ? 'Prestataires audités à Douala · Tarifs transparents en FCFA' 
                    : 'Audited Douala wedding professionals · Transparent pricing in FCFA'}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('pricing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#4D0E1B] bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  {t.listBusinessBtn || 'List Your Business'}
                </button>

                <button
                  onClick={handleHeroSearch}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t.findVendorsBtn || 'Find Vendors'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
              {lang === 'fr' ? 'Corps de Métiers' : 'Specialties'}
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {t.categoriesTitle || 'Popular Event Categories'}
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              {t.categoriesSubtitle || 'Every professional discipline brought together to celebrate your union seamlessly in Cameroon.'}
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#801B2E] hover:text-[#9C2239] flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAllCategories || 'View all categories'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {categories.slice(0, 10).map((cat) => {
            const count = vendors.filter(v => v.primaryCategoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchParams(prev => ({ ...prev, category: cat.id }));
                  setCurrentView('browse');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-4 bg-white rounded-xl border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#801B2E] group-hover:bg-[#801B2E] group-hover:text-white transition-colors flex items-center justify-center mb-3">
                  {cat.id === 'cat-venues' && <Building2 className="w-5 h-5" />}
                  {cat.id === 'cat-decor' && <Sparkles className="w-5 h-5" />}
                  {cat.id === 'cat-catering' && <Utensils className="w-5 h-5" />}
                  {cat.id === 'cat-photo-video' && <Camera className="w-5 h-5" />}
                  {cat.id === 'cat-sound-dj' && <Music className="w-5 h-5" />}
                  {cat.id === 'cat-traditional' && <Crown className="w-5 h-5" />}
                  {cat.id === 'cat-rentals' && <Tent className="w-5 h-5" />}
                  {!['cat-venues', 'cat-decor', 'cat-catering', 'cat-photo-video', 'cat-sound-dj', 'cat-traditional', 'cat-rentals'].includes(cat.id) && (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-stone-900 group-hover:text-[#801B2E] transition-colors line-clamp-1 mb-1">
                    {lang === 'fr' ? cat.nameFr : cat.nameEn}
                  </h3>
                  <div className="text-[11px] text-stone-500 font-mono tabular-nums">
                    {count} {lang === 'fr' ? 'prestataires à Douala' : 'vendors in Douala'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Spotlight: Place Sainte Elisa Estate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4D0E1B] text-white rounded-2xl overflow-hidden shadow-xl border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Visual presentation */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[340px]">
              <img
                src="/src/assets/images/venue_place_sainte_elisa_1792577983263.jpg"
                alt="Place Sainte Elisa Estate"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#801B2E] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300/30">
                Landmark Estate · Douala
              </div>
            </div>

            {/* Content & Packages summary */}
            <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                  Featured Partner Venue
                </div>
                <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3">
                  Place Sainte Elisa — Estate & Grand Gala Ballroom
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light mb-6">
                  Engineered to host up to 600 wedding guests in supreme comfort in Douala. Powerful climate control, heavy-duty 150 kVA backup industrial generator guaranteeing uninterrupted power, landscaped tropical gardens for open-air vows, and a private bridal VIP suite.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Capacity</span>
                    <span className="font-semibold text-white">Up to 600 guests</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Energy Security</span>
                    <span className="font-semibold text-amber-300">150 kVA Generator Guaranteed</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Starting From</span>
                    <span className="font-mono tabular-nums font-bold text-white">850,000 FCFA</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedVendorSlug('place-sainte-elisa-douala');
                    setCurrentView('vendor_detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Place Sainte Elisa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSearchParams(prev => ({ ...prev, category: 'cat-venues' }));
                    setCurrentView('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 text-xs font-medium text-white hover:text-amber-200 border border-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Browse all Douala venues
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Verified Vendors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
              Curated Selection
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured & Verified Vendors
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Rigorously vetted professionals guaranteed to deliver excellence in Douala.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 sm:mt-0 text-xs font-semibold text-[#801B2E] hover:text-[#9C2239] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse full directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onSelect={handleSelectVendor} />
          ))}
        </div>
      </section>

      {/* 5. How It Works (3 Clean Steps) */}
      <section className="bg-white py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
              Seamless Experience
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              How Ayila'a Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200">
              <div className="text-xs font-mono font-bold text-[#801B2E] mb-2">01. DISCOVER & FILTER</div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-2">
                Explore Portfolios & Rates
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse verified portfolios, transparent starting prices in FCFA, and availability across Douala neighborhoods (Bonanjo, Akwa, Bonapriso, Yassa).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200">
              <div className="text-xs font-mono font-bold text-[#801B2E] mb-2">02. REQUEST A QUOTE</div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-2">
                Submit Your Requirements
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Send your event specifications for free and receive customized, itemized proposals from verified vendors within 24 to 48 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200">
              <div className="text-xs font-mono font-bold text-[#801B2E] mb-2">03. CELEBRATE CONFIDENTLY</div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-2">
                Lock Terms in Full Peace of Mind
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Confirm your booking terms backed by Place Sainte Elisa quality standards and clear contractual security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Traditional Cameroonian Royal Wedding Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5F2EB] rounded-2xl border border-stone-300/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                Cameroonian Heritage & Cultural Splendor
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mt-2 mb-4">
                Celebrate the Majesty of Your Traditional Wedding & Cultural Dowry
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
                From hand-embroidered royal Toghu robes of the Grassland to authentic Ndop ceremonial fabrics and coastal Sawa customs, find Cameroon's most prestigious master tailors, cultural protocol advisors, and dowry decor specialists.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSearchParams(prev => ({ ...prev, category: 'cat-traditional' }));
                    setCurrentView('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Browse Traditional Wedding Specialists
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3] bg-stone-200">
              <img
                src="/src/assets/images/traditional_cameroonian_attire_1792577983216.jpg"
                alt="Traditional Cameroonian royal wedding"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Cameroon Mobile Money Payment Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#801B2E] flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-1">
                Cameroon Mobile Money Secure Checkout
              </h3>
              <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                Pay subscription plans or booking deposits securely via your local MTN MoMo (*126#) or Orange Money (#150#) accounts with verified transaction references and administrative audit protection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 bg-[#FFCC00] text-stone-900 font-bold text-xs rounded-lg shadow-sm">
              MTN MoMo
            </div>
            <div className="px-3 py-1.5 bg-[#FF7900] text-white font-bold text-xs rounded-lg shadow-sm">
              Orange Money
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
            FAQ
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-stone-900 hover:text-[#801B2E] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-stone-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Become a Vendor CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4D0E1B] text-white rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto border border-stone-800 shadow-xl">
          <h2 className="font-serif-display text-2xl sm:text-4xl font-bold mb-3">
            Are You an Event Professional in Douala?
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Join Cameroon's premier wedding directory. Showcase your work to high-budget couples and accelerate your business bookings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('pricing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Explore Membership Plans
            </button>
            <button
              onClick={() => {
                setCurrentView('guidelines');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 text-xs font-medium text-white hover:text-amber-200 border border-white/20 rounded-lg transition-colors cursor-pointer"
            >
              Vendor Quality Charter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
