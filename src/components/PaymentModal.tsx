import React, { useState } from 'react';
import { useMarketplace } from '../services/store';
import { formatXAF, isValidCameroonPhone } from '../utils/formatters';
import { PaymentProvider, PaymentPurpose } from '../types';
import { X, CheckCircle, ShieldCheck, Smartphone, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountXaf: number;
  purpose: PaymentPurpose;
  title: string;
  vendorId?: string;
  inquiryId?: string;
  planId?: 'free' | 'starter' | 'pro' | 'featured';
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amountXaf,
  purpose,
  title,
  vendorId,
  inquiryId,
  planId,
  onPaymentSuccess,
}) => {
  const { currentUser, submitPayment, upgradeVendorPlan, purchaseLeadAccess } = useMarketplace();

  const [provider, setProvider] = useState<PaymentProvider>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '+237 699 00 00 00');
  const [txRef, setTxRef] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !isValidCameroonPhone(phoneNumber)) {
      setError('Please provide a valid Cameroon Mobile Money number (+237 6XX XX XX XX).');
      return;
    }

    setStatus('processing');
    setError('');

    // Generate simulated reference code if empty
    const generatedRef = txRef.trim() || `${provider === 'mtn_momo' ? 'MTN' : 'OM'}-CM-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(() => {
      if (purpose === 'subscription' && vendorId && planId) {
        upgradeVendorPlan(vendorId, planId, generatedRef);
      } else if (purpose === 'lead_purchase' && vendorId && inquiryId) {
        purchaseLeadAccess(vendorId, inquiryId);
      } else {
        submitPayment({
          payerUserId: currentUser.id,
          vendorId,
          amountXaf,
          paymentProvider: provider,
          transactionReference: generatedRef,
          payerPhone: phoneNumber,
          paymentPurpose: purpose,
          notes: title,
        });
      }

      setStatus('success');
      if (onPaymentSuccess) onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#4D0E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-display text-lg font-bold">
              Cameroon Mobile Money Checkout
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-serif-display text-xl font-bold text-stone-900">
              Payment Successfully Verified!
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your transaction of {formatXAF(amountXaf)} was recorded on {provider === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'}. Your services are activated.
            </p>
            <button
              onClick={() => { setStatus('idle'); onClose(); }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#801B2E] rounded-lg hover:bg-[#9C2239] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-4 text-stone-800 text-xs">
            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Purpose & Amount Display */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Description</span>
                <span className="font-semibold text-stone-900">{title}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Amount</span>
                <span className="font-mono tabular-nums text-base font-bold text-[#4D0E1B]">
                  {formatXAF(amountXaf)}
                </span>
              </div>
            </div>

            {/* Choose Operator */}
            <div>
              <label className="block font-medium text-stone-700 mb-2">
                Select your Cameroon network provider:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('mtn_momo')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    provider === 'mtn_momo'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400 font-semibold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFCC00] text-stone-900 font-bold flex items-center justify-center text-xs">
                    MTN
                  </div>
                  <span className="text-stone-900 font-medium">MTN MoMo</span>
                  <span className="text-[10px] text-stone-500">*126#</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('orange_money')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    provider === 'orange_money'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400 font-semibold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF7900] text-white font-bold flex items-center justify-center text-xs">
                    OM
                  </div>
                  <span className="text-stone-900 font-medium">Orange Money</span>
                  <span className="text-[10px] text-stone-500">#150#</span>
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Mobile Money Account Phone (+237) *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+237 699 00 00 00"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#801B2E] font-mono"
                required
              />
            </div>

            {/* Reference */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-stone-700">
                  SMS Reference Code (optional in test mode)
                </label>
                <span className="text-[10px] text-stone-400 font-mono">auto-generated</span>
              </div>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. MTN-CM-99482103"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none font-mono"
              />
            </div>

            {/* Security note */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Encrypted payment protocol: Authenticated by PIN on your phone handset. No secret credentials stored on server.
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'processing'}
                className="px-5 py-2.5 font-semibold text-white bg-[#801B2E] hover:bg-[#9C2239] rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {status === 'processing' ? (
                  <span>Contacting Network...</span>
                ) : (
                  <span>Pay {formatXAF(amountXaf)}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
