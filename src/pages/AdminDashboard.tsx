import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF, formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    vendors,
    verifyVendor,
    toggleFeaturedVendor,
    inquiries,
    bookings,
    payments,
    auditLogs,
    verifyPaymentByAdmin,
    resetAllDemoData,
    setCurrentView,
    setSelectedVendorSlug,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'payments' | 'audit'>('overview');
  const [vendorFilter, setVendorFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Metrics
  const totalVendors = vendors.length;
  const verifiedVendors = vendors.filter(v => v.verificationStatus === 'verified').length;
  const totalInquiries = inquiries.length;
  const totalBookings = bookings.length;
  const verifiedRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((acc, curr) => acc + curr.amountXaf, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  const filteredVendors = vendors.filter(v => {
    if (vendorFilter === 'verified') return v.verificationStatus === 'verified';
    if (vendorFilter === 'pending') return v.verificationStatus === 'pending' || v.verificationStatus === 'unverified';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-[#4D0E1B] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#661324] border border-amber-300/30 flex items-center justify-center text-amber-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-widest">
              Executive Directorate · Ayila'a Cameroon
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold">
              Administration & Audit Console
            </h1>
            <div className="text-xs text-stone-300 mt-0.5">
              Supervision of vendor directories, Douala on-site audits, Mobile Money flows, and bookings.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllDemoData}
            className="px-4 py-2 text-xs font-semibold text-amber-200 bg-[#661324] hover:bg-[#801B2E] border border-amber-300/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset application to baseline demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Listed Vendors
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold text-stone-900 mt-1 block">
            {totalVendors}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">
            {verifiedVendors} audited & certified
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Quote Inquiries (Leads)
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold text-stone-900 mt-1 block">
            {totalInquiries}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            Across all categories
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Confirmed Bookings
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold text-emerald-700 mt-1 block">
            {totalBookings}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            Contracted ceremonies
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Verified Platform Revenue
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold text-[#4D0E1B] mt-1 block">
            {formatXAF(verifiedRevenue)}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">
            Subscriptions & Sponsoring
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Pending Transactions
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold text-stone-900 mt-1 block">
            {pendingPayments.length}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            MTN MoMo / Orange Money
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'overview'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'vendors'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Vendor Auditing & Approval ({totalVendors})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'payments'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Mobile Money Transactions ({payments.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'audit'
              ? 'border-[#801B2E] text-[#801B2E]'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Audit Log Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab Content: Vendors Moderation Queue */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVendorFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  vendorFilter === 'all' ? 'bg-[#801B2E] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                All Vendors ({vendors.length})
              </button>
              <button
                onClick={() => setVendorFilter('verified')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  vendorFilter === 'verified' ? 'bg-[#801B2E] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Audited & Verified ({verifiedVendors})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Business & Location</th>
                  <th className="p-4">Starting Price</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/50">
                    <td className="p-4">
                      <div className="font-semibold text-stone-900">{v.businessName}</div>
                      <div className="text-[11px] text-stone-500">{v.neighborhood}, {v.city} · {v.phone}</div>
                    </td>
                    <td className="p-4 font-mono tabular-nums font-bold text-stone-900">
                      {formatXAF(v.startingPriceXaf)}
                    </td>
                    <td className="p-4">
                      {v.verificationStatus === 'verified' ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Audited & Certified
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleFeaturedVendor(v.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          v.featured ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {v.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {v.verificationStatus !== 'verified' ? (
                        <button
                          onClick={() => verifyVendor(v.id, 'verified')}
                          className="px-3 py-1.5 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                        >
                          Approve & Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => verifyVendor(v.id, 'pending')}
                          className="px-3 py-1.5 text-[11px] font-medium text-stone-700 hover:text-red-700 border border-stone-200 rounded-lg cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedVendorSlug(v.slug);
                          setCurrentView('vendor_detail');
                        }}
                        className="px-3 py-1.5 text-[11px] text-[#801B2E] hover:underline"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Payments Audit */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Transaction Ref</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Amount (FCFA)</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="p-4">
                      <span className="font-mono font-bold text-stone-900 block">{p.transactionReference}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{formatDate(p.createdAt, 'en')}</span>
                    </td>
                    <td className="p-4 font-semibold text-stone-800">
                      {p.paymentProvider === 'mtn_momo' ? 'MTN Mobile Money' : 'Orange Money'}
                    </td>
                    <td className="p-4 font-mono tabular-nums font-bold text-[#4D0E1B]">
                      {formatXAF(p.amountXaf)}
                    </td>
                    <td className="p-4 text-stone-600">{p.notes || p.paymentPurpose}</td>
                    <td className="p-4">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'verified' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status === 'verified' ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status !== 'verified' && (
                        <button
                          onClick={() => verifyPaymentByAdmin(p.id)}
                          className="px-3 py-1.5 text-[11px] font-semibold text-white bg-emerald-600 rounded-lg cursor-pointer"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6 space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-stone-900">
            Administrative Action Traceability
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#801B2E]">{log.action}</span>
                  <span className="text-stone-500 ml-2">by {log.actorName}</span>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Entity: {log.entityType} ({log.entityId})
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">
                  {formatDate(log.createdAt, 'en')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              Key Operational Zones in Douala
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The marketplace actively covers Douala 1 (Bonanjo, Bali, Akwa), Douala 2, Douala 4, and Douala 5 (Makepe, Denver, Kotto, and Yassa for Place Sainte Elisa Estate).
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Bonanjo / Administrative Halls & Cinema</span>
                <span className="font-mono font-bold text-[#801B2E]">3 vendors</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Akwa / Scenography & Decor Studios</span>
                <span className="font-mono font-bold text-[#801B2E]">2 vendors</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Bonapriso / Fine Catering & Limousines</span>
                <span className="font-mono font-bold text-[#801B2E]">2 vendors</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Yassa / Place Sainte Elisa Grand Estate</span>
                <span className="font-mono font-bold text-[#801B2E]">1 estate (600 seats)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              Cameroon Compliance Standard
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every vendor carrying the "Audited & Certified" badge has passed verified checks including valid fiscal identification (NUI / RCCM), technical equipment inspections, and health/soundproofing standards.
            </p>
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs border border-emerald-200">
              <strong>Zero-Interruption Guarantee:</strong> Partner reception venues must operate an on-site high-capacity industrial backup generator.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
