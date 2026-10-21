import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { Sparkles, User, ShieldCheck, Heart, Layers, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    t,
    currentUser,
    switchUserRole,
    currentView,
    setCurrentView,
    setSelectedVendorSlug,
    comparisonVendorIds,
    favoriteVendorIds,
  } = useMarketplace();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navigateTo = (view: string, slug: string | null = null) => {
    setSelectedVendorSlug(slug);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      {/* Top utility alert bar: Cameroon launch notice and role switcher for reviewer */}
      <div className="bg-[#4D0E1B] text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium tracking-wide">Cameroon · Douala</span>
          <span className="opacity-60" aria-hidden="true">|</span>
          <span className="hidden sm:inline opacity-90 text-[11px]">
            {lang === 'fr' 
              ? 'Monnaie officielle : Franc CFA (XAF) · MTN MoMo & Orange Money acceptés' 
              : 'Official Currency: CFA Franc (XAF) · MTN MoMo & Orange Money Supported'}
          </span>
        </div>

        {/* Live Role Switcher dropdown for reviewer testing of all 4 account workflows */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-200 font-medium">
            <span className="opacity-75 hidden md:inline">
              {lang === 'fr' ? 'Mode Compte :' : 'Account Mode:'}
            </span>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="bg-[#661324] hover:bg-[#801B2E] border border-amber-300/40 px-2 py-0.5 rounded text-amber-100 flex items-center gap-1 transition-colors cursor-pointer"
              title="Switch user perspective to test workflows"
            >
              <span className="font-semibold capitalize">
                {currentUser.role === 'admin' 
                  ? (lang === 'fr' ? 'Administrateur' : 'Administrator')
                  : currentUser.role === 'vendor' 
                  ? (lang === 'fr' ? 'Prestataire (Sainte Elisa)' : 'Vendor (Sainte Elisa)')
                  : currentUser.role === 'event_planner' 
                  ? (lang === 'fr' ? 'Organisateur Pro' : 'Event Planner Pro')
                  : (lang === 'fr' ? 'Client (Couple)' : 'Customer (Couple)')}
              </span>
              <span className="text-[9px]">▼</span>
            </button>
          </div>

          {roleMenuOpen && (
            <div className="absolute right-0 top-7 w-60 bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1 z-50 text-left text-xs">
              <div className="px-3 py-1.5 border-b border-stone-800 text-[10px] uppercase tracking-wider text-stone-400">
                Switch Test Account
              </div>
              <button
                onClick={() => { switchUserRole('admin'); setRoleMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors ${currentUser.role === 'admin' ? 'text-amber-300 font-semibold bg-stone-800/60' : 'text-stone-200'}`}
              >
                <span>Managing Director (Admin)</span>
                {currentUser.role === 'admin' && <span className="text-amber-400 text-xs">✓</span>}
              </button>
              <button
                onClick={() => { switchUserRole('vendor'); setRoleMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors ${currentUser.role === 'vendor' ? 'text-amber-300 font-semibold bg-stone-800/60' : 'text-stone-200'}`}
              >
                <span>Vendor (Place Sainte Elisa)</span>
                {currentUser.role === 'vendor' && <span className="text-amber-400 text-xs">✓</span>}
              </button>
              <button
                onClick={() => { switchUserRole('customer'); setRoleMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors ${currentUser.role === 'customer' ? 'text-amber-300 font-semibold bg-stone-800/60' : 'text-stone-200'}`}
              >
                <span>Customer (Sandrine & Marc)</span>
                {currentUser.role === 'customer' && <span className="text-amber-400 text-xs">✓</span>}
              </button>
              <button
                onClick={() => { switchUserRole('event_planner'); setRoleMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-800 transition-colors ${currentUser.role === 'event_planner' ? 'text-amber-300 font-semibold bg-stone-800/60' : 'text-stone-200'}`}
              >
                <span>Event Planner Pro</span>
                {currentUser.role === 'event_planner' && <span className="text-amber-400 text-xs">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in Cormorant Garamond */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#4D0E1B] group-hover:text-[#801B2E] transition-colors">
                Ayila'a
              </span>
              <span className="text-stone-300 font-light text-xl">|</span>
              <span className="font-serif-display text-lg sm:text-xl font-normal text-stone-700 tracking-wide">
                Place Sainte Elisa
              </span>
            </div>
            <div className="text-[10px] text-stone-500 font-medium tracking-widest uppercase">
              Douala · Cameroon
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => navigateTo('home')}
            className={`whitespace-nowrap hover:text-[#801B2E] transition-colors cursor-pointer pb-0.5 ${
              currentView === 'home' ? 'text-[#801B2E] border-b-2 border-[#801B2E] font-semibold' : ''
            }`}
          >
            {t.navHome || 'Home'}
          </button>

          <button
            onClick={() => navigateTo('browse')}
            className={`whitespace-nowrap hover:text-[#801B2E] transition-colors cursor-pointer pb-0.5 ${
              currentView === 'browse' ? 'text-[#801B2E] border-b-2 border-[#801B2E] font-semibold' : ''
            }`}
          >
            {t.navBrowse || 'Browse Vendors'}
          </button>

          <button
            onClick={() => {
              setSelectedVendorSlug('place-sainte-elisa-douala');
              setCurrentView('vendor_detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap hover:text-[#801B2E] transition-colors cursor-pointer pb-0.5`}
          >
            {t.navVenues || 'Venues & Estates'}
          </button>

          <button
            onClick={() => navigateTo('pricing')}
            className={`whitespace-nowrap hover:text-[#801B2E] transition-colors cursor-pointer pb-0.5 ${
              currentView === 'pricing' ? 'text-[#801B2E] border-b-2 border-[#801B2E] font-semibold' : ''
            }`}
          >
            {t.navPricing || 'Pricing & Plans'}
          </button>

          <button
            onClick={() => navigateTo('compare')}
            className={`whitespace-nowrap hover:text-[#801B2E] transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 ${
              currentView === 'compare' ? 'text-[#801B2E] border-b-2 border-[#801B2E] font-semibold' : ''
            }`}
          >
            <span>{t.navCompare || 'Compare'}</span>
            {comparisonVendorIds.length > 0 && (
              <span className="text-[11px] font-mono tabular-nums bg-amber-100 text-[#801B2E] px-1.5 py-0.2 rounded-full font-bold">
                {comparisonVendorIds.length}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Dashboard / Role Gateway */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Favorites quick counter */}
          <button
            onClick={() => navigateTo('dashboard_customer')}
            className="hidden sm:flex items-center text-stone-600 hover:text-[#801B2E] transition-colors relative p-1.5 cursor-pointer"
            title={lang === 'fr' ? 'Favoris enregistrés' : 'Saved favorites'}
          >
            <Heart className="w-5 h-5 text-stone-500 hover:text-[#801B2E]" />
            {favoriteVendorIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#801B2E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                {favoriteVendorIds.length}
              </span>
            )}
          </button>

          {/* Dynamic Role Dashboard CTA */}
          {currentUser.role === 'admin' ? (
            <button
              onClick={() => navigateTo('dashboard_admin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#4D0E1B] rounded-lg hover:bg-[#661324] transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.navAdmin || 'Admin Console'}</span>
            </button>
          ) : currentUser.role === 'vendor' ? (
            <button
              onClick={() => navigateTo('dashboard_vendor')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#801B2E] rounded-lg hover:bg-[#9C2239] transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'fr' ? 'Espace Prestataire' : 'Vendor Portal'}</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('dashboard_customer')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#801B2E] rounded-lg hover:bg-[#9C2239] transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.navDashboard || 'My Dashboard'}</span>
            </button>
          )}

          {/* Quick List Business CTA for vendors */}
          <button
            onClick={() => navigateTo('pricing')}
            className="hidden xl:inline-flex px-3.5 py-2 text-xs font-medium text-[#4D0E1B] bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.listBusinessBtn || 'List Your Business'}
          </button>
        </div>
      </div>
    </header>
  );
};
