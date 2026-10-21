import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF } from '../utils/formatters';
import { VendorPlan } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import {
  CheckCircle2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Building2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { lang, vendorPlans, vendors, currentUser } = useMarketplace();

  const [selectedPlan, setSelectedPlan] = useState<VendorPlan | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const myVendor = vendors.find(v => v.ownerUserId === currentUser.id) || vendors[0];

  const handleSelectPlan = (plan: VendorPlan) => {
    if (plan.priceXaf === 0) {
      alert(lang === 'fr' 
        ? 'La formule Basique Découverte est activée par défaut pour toute entreprise enregistrée.' 
        : 'The Free Basic listing is active by default for all registered businesses.');
      return;
    }
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
          {lang === 'fr' ? 'Visibilité & Partenariats Prestataires' : 'Vendor Membership & Visibility'}
        </span>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          {lang === 'fr' 
            ? 'Développez Votre Clientèle Événementielle au Cameroun' 
            : 'Grow Your Wedding & Event Business in Cameroon'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          {lang === 'fr'
            ? 'Inscrivez gratuitement votre entreprise sur Ayila\'a ou accédez à nos formules de visibilité renforcée pour capter les plus belles célébrations de Douala et du Cameroun.'
            : 'List your business for free on Ayila\'a or upgrade to premium visibility to connect with couples and event planners booking in Douala and across Cameroon.'}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendorPlans.map((plan) => {
          const isCurrent = myVendor.planId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'bg-white border-2 border-[#801B2E] shadow-xl ring-4 ring-[#801B2E]/5'
                  : 'bg-white border border-stone-200 shadow-sm hover:border-amber-400'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#801B2E] text-amber-200 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {lang === 'fr' ? 'Recommandé Douala' : 'Recommended Douala'}
                </div>
              )}

              <div>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  {lang === 'fr' ? plan.nameFr : plan.nameEn}
                </h3>
                <div className="font-mono tabular-nums text-2xl font-bold text-[#4D0E1B] my-3">
                  {plan.priceXaf === 0 ? (lang === 'fr' ? 'Gratuit' : 'Free') : formatXAF(plan.priceXaf)}
                  {plan.priceXaf > 0 && (
                    <span className="text-xs text-stone-500 font-normal ml-1">
                      {lang === 'fr' ? '/ mois' : '/ month'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  {lang === 'fr' ? plan.descriptionFr : plan.descriptionEn}
                </p>

                <div className="space-y-2.5 text-xs text-stone-700 mb-8 pt-4 border-t border-stone-100">
                  {(lang === 'fr' ? plan.featuresFr : plan.featuresEn).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrent}
                className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                  isCurrent
                    ? 'bg-stone-100 text-stone-500 cursor-default'
                    : plan.isPopular
                    ? 'bg-[#801B2E] text-white hover:bg-[#9C2239] shadow-md'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {isCurrent
                  ? (lang === 'fr' ? 'Votre Forfait Actuel' : 'Your Current Plan')
                  : plan.priceXaf === 0
                  ? (lang === 'fr' ? 'Commencer Gratuitement' : 'Get Started Free')
                  : (lang === 'fr' ? 'Activer via Mobile Money' : 'Activate via Mobile Money')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Paid Leads Model Explanation */}
      <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#801B2E] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Pay-Per-Lead Marketplace Model</span>
        </div>
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Only Pay for the Inquiries and Leads You Want
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
          In addition to monthly subscription plans, Ayila'a offers a flexible performance-based lead purchase system: unlock verified couple contact numbers and full event requirements starting at <strong>5,000 FCFA per lead</strong>. Exclusive qualified leads are never distributed to more than two competing vendors.
        </p>
      </div>

      {/* Payment Security Note with MTN MoMo & Orange Money */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-[#801B2E]" />
          <div>
            <h4 className="font-serif-display text-base font-bold text-stone-900">
              Secure Local Currency Payments (+237)
            </h4>
            <p className="text-xs text-stone-500">
              Instant verified transactions supported across MTN Cameroon and Orange Cameroun mobile networks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold bg-stone-100 px-3 py-1.5 rounded-lg text-stone-800">
            MTN MoMo (*126#)
          </span>
          <span className="font-mono text-xs font-semibold bg-stone-100 px-3 py-1.5 rounded-lg text-stone-800">
            Orange Money (#150#)
          </span>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amountXaf={selectedPlan.priceXaf}
          purpose="subscription"
          title={`Membership Plan: ${selectedPlan.nameEn}`}
          vendorId={myVendor.id}
          planId={selectedPlan.id}
        />
      )}
    </div>
  );
};
