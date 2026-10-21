import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-stone-800">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#801B2E]">
          {lang === 'fr' ? 'Notre Histoire & Notre Vocation' : 'Our Heritage & Mission'}
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
          Ayila'a | Place Sainte Elisa
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
          {lang === 'fr'
            ? "L'alliance entre la tradition hospitalière camerounaise et l'exigence de l'événementiel haut de gamme contemporain."
            : 'Uniting authentic Cameroonian hospitality with the rigorous standards of contemporary luxury event production.'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-stone-700">
        {lang === 'fr' ? (
          <>
            <p>
              Fondée à <strong>Douala</strong>, capitale économique du Cameroun, <strong>Ayila'a</strong> est née d'un constat partagé par des centaines de futurs mariés et organisateurs : la difficulté de dénicher des prestataires véritablement fiables, ponctuels et transparents sur leurs tarifs.
            </p>
            <p>
              Inspirée par la renommée du domaine emblématique <strong>Place Sainte Elisa</strong>, réputé pour la majesté de ses salons de 600 places et la beauté de ses jardins paysagers à Douala, la plateforme fédère les meilleurs talents de la réception : traiteurs sawa d'exception, maîtres sculpteurs de gâteaux, stylistes de Toghu et Ndop royaux, photographes cinématiques et spécialistes du son.
            </p>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-stone-800 text-xs">
              <strong>Notre engagement d'audit :</strong> Aucun prestataire ne reçoit notre label de vérification sans un contrôle strict de ses capacités techniques, notamment la disponibilité d'une alimentation électrique secourue pour pallier tout aléa du réseau.
            </div>
          </>
        ) : (
          <>
            <p>
              Founded in <strong>Douala</strong>, the economic heartbeat of Cameroon, <strong>Ayila'a</strong> was born from a common frustration experienced by couples and event organizers: the challenge of finding verified, punctual, and transparently priced wedding vendors.
            </p>
            <p>
              Inspired by the esteemed standard of <strong>Place Sainte Elisa</strong>—renowned for its 600-capacity climate-controlled grand ballroom, manicured tropical ceremony gardens, and dedicated bridal suites in Douala—our platform connects discerning clients with verified event masters: artisanal Sawa banquet caterers, pastry artists, royal Toghu and Ndop traditional tailors, 4K cinematic videographers, and acoustic sound specialists.
            </p>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-stone-800 text-xs">
              <strong>Our Verification Commitment:</strong> Every audited vendor on Ayila'a undergoes strict verification of technical reliability, including mandatory on-site backup generator power to protect your celebration against electrical grid fluctuations.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { lang } = useMarketplace();
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-stone-800">
      <div className="text-center space-y-2">
        <h1 className="font-serif-display text-3xl font-bold text-stone-900">
          {lang === 'fr' ? 'Contact & Conciergerie Événementielle' : 'Contact & Event Concierge'}
        </h1>
        <p className="text-xs text-stone-600">
          {lang === 'fr' 
            ? 'Nos équipes basées à Douala vous accompagnent du lundi au samedi.' 
            : 'Our Douala-based concierge team is available to assist you Monday through Saturday.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif-display text-lg font-bold text-stone-900">
            {lang === 'fr' ? "Siège Ayila'a Douala" : "Ayila'a Headquarters Douala"}
          </h3>
          <div className="space-y-3 text-stone-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#801B2E] shrink-0 mt-0.5" />
              <span>Boulevard de la Liberté, Bonanjo, Douala, {lang === 'fr' ? 'Cameroun' : 'Cameroon'}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#801B2E] shrink-0 mt-0.5" />
              <span className="font-mono">+237 699 45 22 10 / +237 677 34 89 21</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#801B2E] shrink-0 mt-0.5" />
              <span>concierge@placesainteelisa.cm</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          {sent ? (
            <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl">
              {lang === 'fr' 
                ? 'Merci ! Votre message a été transmis avec succès à notre conciergerie à Douala.' 
                : 'Thank you! Your inquiry has been sent to our Douala concierge team.'}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <input type="text" required placeholder="e.g. Vanessa & Paul" className="w-full p-2 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'fr' ? 'Numéro de Téléphone (+237)' : 'Phone Number (+237)'}
                </label>
                <input type="tel" placeholder="+237 6XX XX XX XX" required className="w-full p-2 border border-stone-300 rounded-lg font-mono" />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'fr' ? 'Votre message' : 'Your Message'}
                </label>
                <textarea 
                  rows={3} 
                  required 
                  placeholder={lang === 'fr' 
                    ? "Précisez votre date, quartier à Douala ou vos attentes de devis..." 
                    : "Tell us about your event date, estimated guests, or venue requirements..."} 
                  className="w-full p-2 border border-stone-300 rounded-lg" 
                />
              </div>
              <button type="submit" className="w-full py-2.5 text-xs font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors cursor-pointer">
                {lang === 'fr' ? 'Envoyer le Message' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const GuidelinesPage: React.FC = () => {
  const { lang } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-stone-800">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#801B2E]">
          {lang === 'fr' ? 'Charte Qualité Officielle' : 'Official Quality Standard'}
        </span>
        <h1 className="font-serif-display text-3xl font-bold text-stone-900">
          {lang === 'fr' ? 'Charte de Vérification des Prestataires à Douala' : 'Vendor Verification & Audit Charter'}
        </h1>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-stone-900 mb-1">
              {lang === 'fr' ? '1. Régularité Juridique & Fiscale' : '1. Legal & Business Standing'}
            </h3>
            <p>
              {lang === 'fr' 
                ? "Tout prestataire professionnel doit attester d'une existence légale au Cameroun (NUI / RCCM)." 
                : 'Every certified professional must demonstrate active registration and verified commercial establishment in Cameroon (NUI / RCCM).'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-stone-900 mb-1">
              {lang === 'fr' ? '2. Sécurité Énergétique Obligatoire' : '2. Mandatory Power Reliability Protocol'}
            </h3>
            <p>
              {lang === 'fr' 
                ? "Pour les salles de réception et régies techniques, obligation de disposer d'un groupe électrogène de secours opérationnel." 
                : 'Reception halls and sound production services must maintain an operational backup diesel generator on site to prevent any disruption during receptions.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-stone-900 mb-1">
              {lang === 'fr' ? '3. Transparence Tarifaire en FCFA' : '3. Transparent XAF Pricing & Contract Honesty'}
            </h3>
            <p>
              {lang === 'fr' 
                ? "Interdiction d'appliquer des majorations non contractuelles le jour de l'événement." 
                : 'Vendors commit to clear FCFA price quotations without unexpected day-of surcharges or unilateral schedule cancellations.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { lang } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs text-stone-700 leading-relaxed">
      <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
        {lang === 'fr' ? "Conditions Générales d'Utilisation" : 'Terms & Conditions of Service'}
      </h1>
      <p>
        {lang === 'fr'
          ? "En accédant à la plateforme Ayila'a | Place Sainte Elisa, tout utilisateur accepte les présentes conditions régies par la législation commerciale camerounaise."
          : 'By accessing the Ayila\'a | Place Sainte Elisa platform, all users and vendors accept these service conditions governed under the commercial laws of the Republic of Cameroon.'}
      </p>
      <h3 className="font-bold text-stone-900 text-sm mt-4">
        {lang === 'fr' ? 'Demandes, Devis et Réservations' : 'Inquiries, Quotes & Bookings'}
      </h3>
      <p>
        {lang === 'fr'
          ? "Les accords financiers entre clients et prestataires font l'objet de devis formalisés. La plateforme agit en tant que facilitateur de découverte et tiers de confiance de mise en relation."
          : 'Financial agreements and deposits between clients and vendors are formalized via detailed quotes. Ayila\'a facilitates verified discovery, portfolio inspection, and trusted communication.'}
      </p>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { lang } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs text-stone-700 leading-relaxed">
      <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
        {lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy & Data Security'}
      </h1>
      <p>
        {lang === 'fr'
          ? 'Vos données personnelles (numéro de téléphone, adresse email, détails de mariage) sont strictement protégées et ne sont jamais revendues à des tiers non sollicités. Seuls les prestataires auxquels vous soumettez une demande ont accès à vos coordonnées de contact.'
          : 'Your personal details (phone number, email address, and event specifications) are rigorously protected and never sold to unauthorized third parties. Only vendors to whom you deliberately submit a quote inquiry or request for proposal have access to your contact information.'}
      </p>
    </div>
  );
};
