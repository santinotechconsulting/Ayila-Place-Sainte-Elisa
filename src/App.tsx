/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketplaceProvider, useMarketplace } from './services/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { VendorDetailPage } from './pages/VendorDetailPage';
import { ComparePage } from './pages/ComparePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PricingPage } from './pages/PricingPage';
import { AboutPage, ContactPage, GuidelinesPage, TermsPage, PrivacyPage } from './pages/StaticPages';

const MainRouter: React.FC = () => {
  const { currentView } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#801B2E] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'browse' && <BrowsePage />}
        {currentView === 'vendor_detail' && <VendorDetailPage />}
        {currentView === 'compare' && <ComparePage />}
        {currentView === 'pricing' && <PricingPage />}
        {currentView === 'dashboard_customer' && <CustomerDashboard />}
        {currentView === 'dashboard_vendor' && <VendorDashboard />}
        {currentView === 'dashboard_admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'guidelines' && <GuidelinesPage />}
        {currentView === 'terms' && <TermsPage />}
        {currentView === 'privacy' && <PrivacyPage />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainRouter />
    </MarketplaceProvider>
  );
}
