import React from 'react';
import { useMarketplace } from '../services/store';
import { MapPin, Phone, Mail, ShieldCheck, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setLang, t, setCurrentView, setSelectedVendorSlug } = useMarketplace();

  const navigateTo = (view: string) => {
    setSelectedVendorSlug(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 sm:pt-16 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Directory Grid (Optimized for Mobile & Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1: Brand & Douala Heritage */}
          <div className="space-y-4">
            <button
              onClick={() => navigateTo('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Ayila'a
                </span>
                <span className="text-stone-500 font-light text-xl">|</span>
                <span className="font-serif-display text-lg text-stone-300 font-normal group-hover:text-amber-200 transition-colors">
                  Place Sainte Elisa
                </span>
              </div>
              <div className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase mt-0.5">
                Douala · Cameroon
              </div>
            </button>

            <p className="text-xs text-stone-400 leading-relaxed">
              {t.footerBrandDesc || "Cameroon's premier marketplace for luxury weddings and exceptional events. Connecting couples with audited venues and top wedding professionals in Douala and nationwide."}
            </p>

            <div className="space-y-2 pt-1 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Boulevard de la Liberté, Bonanjo, Douala</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a 
                  href="tel:+237699452210" 
                  className="font-mono hover:text-amber-300 transition-colors"
                >
                  +237 699 45 22 10 / 677 34 89 21
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a 
                  href="mailto:concierge@placesainteelisa.cm" 
                  className="hover:text-amber-300 transition-colors truncate"
                >
                  concierge@placesainteelisa.cm
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Douala Service Areas */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{t.footerDoualaAreasTitle || 'Douala Service Areas'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Bonanjo</strong> — {lang === 'fr' ? 'Salles historiques & Réceptions' : 'Civic Halls & Historic Estates'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Akwa</strong> — {lang === 'fr' ? 'Scénographie & Décors Royaux' : 'Event Scenography & Decor'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Bonapriso</strong> — {lang === 'fr' ? 'Traiteurs Sawa & Pâtisseries' : 'Gourmet Catering & Cakes'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Makepe & Denver</strong> — {lang === 'fr' ? 'Haute Couture Toghu & Ndop' : 'Bridal Boutiques & Tailors'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Yassa</strong> — {lang === 'fr' ? 'Domaine Place Sainte Elisa' : 'Place Sainte Elisa Grand Estate'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5">
                <strong className="text-stone-300">Bali & Deido</strong> — {lang === 'fr' ? 'Sonorisation & DJs' : 'Sound & Celebration DJs'}
              </li>
              <li className="hover:text-stone-200 transition-colors py-0.5 text-stone-500 text-[11px]">
                {lang === 'fr' ? 'Couverture régionale : Yaoundé, Kribi, Buea' : 'Regional: Yaoundé, Kribi, Buea & Limbe'}
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{t.footerPlatformTitle || 'Platform & Directory'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('browse')}
                  className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                >
                  {t.footerBrowseAll || 'Browse All Vendors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('pricing')}
                  className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                >
                  {t.footerPricingPlans || 'Vendor Membership Plans'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('compare')}
                  className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                >
                  {t.footerCompareShortlist || 'Compare Shortlisted Vendors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                >
                  {t.footerAboutUs || "About Ayila'a & Sainte Elisa"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('guidelines')}
                  className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                >
                  {t.footerGuidelines || 'Vendor Verification Charter'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Legal & Language Selector */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{t.footerLegalTitle || 'Trust & Legal Compliance'}</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => navigateTo('terms')}
                    className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                  >
                    {t.footerTerms || 'Terms and Conditions'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('privacy')}
                    className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                  >
                    {t.footerPrivacy || 'Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('contact')}
                    className="hover:text-amber-300 transition-colors cursor-pointer py-1 block text-left min-h-[32px] sm:min-h-0"
                  >
                    {t.footerSupport || 'Customer Support & Concierge'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Cameroon On-Site Audit Trust Seal */}
            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 flex items-center gap-2.5 text-xs text-stone-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="leading-tight">
                <span className="font-semibold text-white block text-[11px]">
                  {lang === 'fr' ? 'Label Vérifié Cameroun' : 'Verified Cameroon Audit'}
                </span>
                <span className="text-[10px] text-stone-400">
                  {t.footerAuditedBadge || 'On-site audited vendors in Douala'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid-tier Footer Bar: Language Switch & Designed By Credit (Highly Optimized for Mobile & Touch) */}
        <div className="py-6 border-b border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Language Switcher between English and French */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.footerLanguageSelect || 'Language:'}</span>
            </div>

            {/* Segmented Touch-friendly Switcher (Minimum 44px height for mobile ergonomics) */}
            <div 
              role="radiogroup" 
              aria-label="Language selection"
              className="inline-flex items-center bg-stone-800/90 p-1 rounded-xl border border-stone-700/80 shadow-inner w-full sm:w-auto justify-center"
            >
              <button
                type="button"
                role="radio"
                aria-checked={lang === 'en'}
                onClick={() => setLang('en')}
                className={`flex-1 sm:flex-initial min-h-[44px] sm:min-h-[36px] px-4 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#801B2E] text-white shadow-md ring-1 ring-amber-300/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
                }`}
                title="Switch to English language"
              >
                <span className="text-sm">🇬🇧</span>
                <span>English</span>
                {lang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5"></span>}
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={lang === 'fr'}
                onClick={() => setLang('fr')}
                className={`flex-1 sm:flex-initial min-h-[44px] sm:min-h-[36px] px-4 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-[#801B2E] text-white shadow-md ring-1 ring-amber-300/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
                }`}
                title="Passer en Français"
              >
                <span className="text-sm">🇫🇷</span>
                <span>Français</span>
                {lang === 'fr' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5"></span>}
              </button>
            </div>
          </div>

          {/* Designed by Santino Tech Consulting Attribution */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 rounded-xl transition-colors text-xs text-stone-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-stone-400">
              {lang === 'fr' ? 'Conçu par' : 'Designed by'}
            </span>
            <span className="font-semibold text-white tracking-wide hover:text-amber-300 transition-colors">
              Santino Tech Consulting
            </span>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Ayila'a | Place Sainte Elisa. {t.footerAllRightsReserved || 'All rights reserved. Republic of Cameroon.'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="font-mono text-stone-400 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/50">
              XAF · FCFA · Douala
            </span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <button
              onClick={() => navigateTo('dashboard_admin')}
              className="text-stone-400 hover:text-amber-300 transition-colors min-h-[36px] sm:min-h-0 flex items-center px-1"
            >
              {lang === 'fr' ? 'Console Administration' : 'Admin Console'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
