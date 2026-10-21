import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Vendor,
  Category,
  Inquiry,
  Booking,
  Review,
  Payment,
  VendorPlan,
  InAppNotification,
  AuditLog,
  UserRole,
  Quote,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_VENDOR_PLANS,
  INITIAL_INQUIRIES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_PAYMENTS,
} from './mockData';
import { Language, translations } from '../utils/i18n';

interface MarketplaceContextType {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.fr;

  // Current session & auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  switchUserRole: (role: UserRole) => void;
  login: (email: string) => boolean;
  logout: () => void;

  // Vendors
  vendors: Vendor[];
  getVendorBySlug: (slug: string) => Vendor | undefined;
  getVendorById: (id: string) => Vendor | undefined;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  verifyVendor: (id: string, status: 'verified' | 'rejected' | 'pending') => void;
  toggleFeaturedVendor: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  toggleCategoryStatus: (id: string) => void;

  // Inquiries & Quotes
  inquiries: Inquiry[];
  submitInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Inquiry;
  sendQuote: (inquiryId: string, quoteData: Omit<Quote, 'id' | 'inquiryId' | 'createdAt'>) => void;
  updateInquiryStatus: (inquiryId: string, status: Inquiry['status']) => void;

  // Bookings
  bookings: Booking[];
  confirmBookingFromInquiry: (inquiryId: string) => Booking;
  cancelBooking: (bookingId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'verified'>) => void;
  getReviewsByVendorId: (vendorId: string) => Review[];

  // Comparison List (Max 4)
  comparisonVendorIds: string[];
  addToComparison: (vendorId: string) => boolean;
  removeFromComparison: (vendorId: string) => void;
  clearComparison: () => void;

  // Favorites
  favoriteVendorIds: string[];
  toggleFavorite: (vendorId: string) => void;
  isFavorite: (vendorId: string) => boolean;

  // Monetization & Payments
  vendorPlans: VendorPlan[];
  payments: Payment[];
  submitPayment: (paymentData: Omit<Payment, 'id' | 'status' | 'createdAt' | 'verifiedAt'>) => Payment;
  verifyPaymentByAdmin: (paymentId: string) => void;
  upgradeVendorPlan: (vendorId: string, planId: VendorPlan['id'], paymentRef: string) => void;
  purchaseLeadAccess: (vendorId: string, inquiryId: string) => boolean;

  // Notifications
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Audit Logs
  auditLogs: AuditLog[];

  // Active Navigation & View State
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedVendorSlug: string | null;
  setSelectedVendorSlug: (slug: string | null) => void;
  searchParams: {
    category: string;
    neighborhood: string;
    budgetMax: number;
    date: string;
    verifiedOnly: boolean;
    query: string;
    sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating';
  };
  setSearchParams: React.Dispatch<React.SetStateAction<MarketplaceContextType['searchParams']>>;
  resetSearch: () => void;
  resetAllDemoData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'ayilaa_cameroon_v1_';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization: Supports English (default) and French
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'lang') as Language;
    return saved === 'fr' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = translations[lang] || translations.en;

  // Users
  const [availableUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Default to Admin for testing all tabs easily
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUserRole = (role: UserRole) => {
    const found = availableUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      const newUser: User = {
        id: `user-${role}-test`,
        fullName: role === 'customer' ? 'Sandrine & Marc Ebelle' : role === 'vendor' ? 'Events Manager Sainte Elisa' : role === 'event_planner' ? 'Douala Prestige Wedding Planners' : 'Managing Director Ayila\'a',
        email: `${role}@ayilaa.cm`,
        phone: '+237 699 12 34 56',
        preferredLanguage: 'en',
        role: role,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
    }
  };

  const login = (email: string): boolean => {
    const found = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Simple registration/login fallback
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: email.split('@')[0],
      email: email,
      phone: '+237 690 00 00 00',
      preferredLanguage: lang,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(INITIAL_USERS[2]); // Revert to customer
  };

  // Vendors
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'vendors');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_VENDORS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vendors', JSON.stringify(vendors));
  }, [vendors]);

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'categories');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'categories', JSON.stringify(categories));
  }, [categories]);

  // Inquiries
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Comparison
  const [comparisonVendorIds, setComparisonVendorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'compare');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['vendor-sainte-elisa', 'vendor-royal-decor'];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'compare', JSON.stringify(comparisonVendorIds));
  }, [comparisonVendorIds]);

  // Favorites
  const [favoriteVendorIds, setFavoriteVendorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['vendor-sainte-elisa', 'vendor-sawa-delights'];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'favorites', JSON.stringify(favoriteVendorIds));
  }, [favoriteVendorIds]);

  // Payments
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'payments');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PAYMENTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'payments', JSON.stringify(payments));
  }, [payments]);

  // Notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: 'notif-1',
      userId: 'user-admin-1',
      type: 'inquiry',
      title: 'New quote request received in Douala',
      message: 'Sandrine & Marc submitted an inquiry for December 19, 2026 at Place Sainte Elisa.',
      read: false,
      createdAt: '2026-10-18T10:30:00Z',
    },
    {
      id: 'notif-2',
      userId: 'user-vendor-1',
      type: 'payment',
      title: 'Featured Sponsor Subscription Active',
      message: 'Your top hero placement in Douala has been verified for 30 days via MTN Mobile Money.',
      read: false,
      createdAt: '2026-10-01T10:15:00Z',
    }
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      actorUserId: 'user-admin-1',
      actorName: 'Managing Director',
      action: 'APPROVE_VENDOR',
      entityType: 'vendor',
      entityId: 'vendor-sainte-elisa',
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      id: 'log-2',
      actorUserId: 'user-admin-1',
      actorName: 'Managing Director',
      action: 'VERIFY_PAYMENT_MTN_MOMO',
      entityType: 'payment',
      entityId: 'pay-001',
      createdAt: '2026-10-01T10:15:00Z',
    }
  ]);

  const addAuditLog = (action: string, entityType: string, entityId: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: currentUser.id,
      actorName: currentUser.fullName,
      action,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Navigation & Search State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedVendorSlug, setSelectedVendorSlug] = useState<string | null>(null);

  const initialSearchParams: {
    category: string;
    neighborhood: string;
    budgetMax: number;
    date: string;
    verifiedOnly: boolean;
    query: string;
    sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating';
  } = {
    category: '',
    neighborhood: '',
    budgetMax: 3000000,
    date: '',
    verifiedOnly: false,
    query: '',
    sortBy: 'relevance',
  };

  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const resetSearch = () => {
    setSearchParams(initialSearchParams);
  };

  // Vendor actions
  const getVendorBySlug = (slug: string) => vendors.find(v => v.slug === slug);
  const getVendorById = (id: string) => vendors.find(v => v.id === id);

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `vendor-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVendors(prev => [newVendor, ...prev]);
    addAuditLog('REGISTER_VENDOR', 'vendor', newVendor.id);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    addAuditLog('UPDATE_VENDOR_PROFILE', 'vendor', id);
  };

  const verifyVendor = (id: string, status: 'verified' | 'rejected' | 'pending') => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, verificationStatus: status } : v));
    addAuditLog(`VERIFICATION_${status.toUpperCase()}`, 'vendor', id);
  };

  const toggleFeaturedVendor = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
    addAuditLog('TOGGLE_FEATURED_STATUS', 'vendor', id);
  };

  // Category actions
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
    addAuditLog('CREATE_CATEGORY', 'category', newCat.id);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // Inquiries & Quotes
  const submitInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
    const newInq: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setInquiries(prev => [newInq, ...prev]);

    // Send in-app notification to vendor
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      userId: inquiryData.vendorId,
      type: 'inquiry',
      title: 'New wedding inquiry received!',
      message: `${inquiryData.customerName} requested a quote for a ${inquiryData.eventType} on ${inquiryData.eventDate}.`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('SUBMIT_INQUIRY', 'inquiry', newInq.id);
    return newInq;
  };

  const sendQuote = (inquiryId: string, quoteData: Omit<Quote, 'id' | 'inquiryId' | 'createdAt'>) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      inquiryId,
      createdAt: new Date().toISOString(),
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'quote_received',
          quote: newQuote,
        };
      }
      return inq;
    }));

    // Notification to customer
    const targetInq = inquiries.find(i => i.id === inquiryId);
    if (targetInq) {
      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        userId: targetInq.customerUserId,
        type: 'quote',
        title: 'Quote proposal received from vendor',
        message: `${targetInq.vendorName} sent you a formal quote of ${newQuote.amountXaf.toLocaleString()} FCFA.`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('SEND_QUOTE', 'quote', newQuote.id);
  };

  const updateInquiryStatus = (inquiryId: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status } : inq));
    addAuditLog(`INQUIRY_STATUS_${status.toUpperCase()}`, 'inquiry', inquiryId);
  };

  // Bookings
  const confirmBookingFromInquiry = (inquiryId: string): Booking => {
    const targetInq = inquiries.find(i => i.id === inquiryId);
    const amount = targetInq?.quote?.amountXaf || targetInq?.budgetMinXaf || 500000;
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      inquiryId,
      customerUserId: targetInq?.customerUserId || currentUser.id,
      vendorId: targetInq?.vendorId || '',
      agreedAmountXaf: amount,
      eventDate: targetInq?.eventDate || new Date().toISOString().split('T')[0],
      status: 'confirmed',
      confirmationTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    updateInquiryStatus(inquiryId, 'confirmed');

    // Add notification
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      userId: newBooking.vendorId,
      type: 'booking',
      title: 'Booking confirmed with client!',
      message: `The booking for ${newBooking.eventDate} has been confirmed.`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('CONFIRM_BOOKING', 'booking', newBooking.id);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    addAuditLog('CANCEL_BOOKING', 'booking', bookingId);
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      verified: true, // Auto-verified for completed simulated bookings
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);

    // Update vendor average rating and review count
    const vendorReviews = [...reviews.filter(r => r.vendorId === reviewData.vendorId), newReview];
    const avg = vendorReviews.reduce((acc, curr) => acc + curr.rating, 0) / vendorReviews.length;
    updateVendor(reviewData.vendorId, {
      rating: parseFloat(avg.toFixed(2)),
      reviewCount: vendorReviews.length,
    });

    addAuditLog('SUBMIT_REVIEW', 'review', newReview.id);
  };

  const getReviewsByVendorId = (vendorId: string) => {
    return reviews.filter(r => r.vendorId === vendorId);
  };

  // Comparisons (Max 4)
  const addToComparison = (vendorId: string): boolean => {
    if (comparisonVendorIds.includes(vendorId)) return true;
    if (comparisonVendorIds.length >= 4) {
      return false; // Limit to 4
    }
    setComparisonVendorIds(prev => [...prev, vendorId]);
    return true;
  };

  const removeFromComparison = (vendorId: string) => {
    setComparisonVendorIds(prev => prev.filter(id => id !== vendorId));
  };

  const clearComparison = () => {
    setComparisonVendorIds([]);
  };

  // Favorites
  const toggleFavorite = (vendorId: string) => {
    setFavoriteVendorIds(prev =>
      prev.includes(vendorId) ? prev.filter(id => id !== vendorId) : [...prev, vendorId]
    );
  };

  const isFavorite = (vendorId: string) => favoriteVendorIds.includes(vendorId);

  // Payments & Monetization
  const submitPayment = (paymentData: Omit<Payment, 'id' | 'status' | 'createdAt' | 'verifiedAt'>): Payment => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      status: 'verified', // Instant verification in dev adapter with valid reference
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newPayment, ...prev]);
    addAuditLog('SUBMIT_PAYMENT', 'payment', newPayment.id);
    return newPayment;
  };

  const verifyPaymentByAdmin = (paymentId: string) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? {
      ...p,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
    } : p));
    addAuditLog('ADMIN_VERIFY_PAYMENT', 'payment', paymentId);
  };

  const upgradeVendorPlan = (vendorId: string, planId: VendorPlan['id'], paymentRef: string) => {
    const plan = INITIAL_VENDOR_PLANS.find(p => p.id === planId);
    if (!plan) return;

    // Create payment record
    submitPayment({
      payerUserId: currentUser.id,
      vendorId: vendorId,
      amountXaf: plan.priceXaf,
      paymentProvider: paymentRef.startsWith('OM') ? 'orange_money' : 'mtn_momo',
      transactionReference: paymentRef,
      payerPhone: currentUser.phone,
      paymentPurpose: 'subscription',
      notes: `Subscription: ${plan.nameEn}`,
    });

    // Update vendor plan and featured badge if applicable
    updateVendor(vendorId, {
      planId: planId,
      featured: planId === 'featured' || planId === 'pro',
    });

    addAuditLog(`UPGRADE_PLAN_${planId.toUpperCase()}`, 'vendor', vendorId);
  };

  const purchaseLeadAccess = (vendorId: string, inquiryId: string): boolean => {
    const leadPrice = 5000; // 5,000 FCFA per qualified Douala wedding lead
    submitPayment({
      payerUserId: currentUser.id,
      vendorId: vendorId,
      amountXaf: leadPrice,
      paymentProvider: 'mtn_momo',
      transactionReference: `LEAD-MOMO-${Date.now().toString().slice(-6)}`,
      payerPhone: currentUser.phone,
      paymentPurpose: 'lead_purchase',
      notes: `Unlock contact details for verified lead #${inquiryId}`,
    });
    addAuditLog('PURCHASE_LEAD', 'inquiry', inquiryId);
    return true;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const resetAllDemoData = () => {
    localStorage.clear();
    setVendors(INITIAL_VENDORS);
    setCategories(INITIAL_CATEGORIES);
    setInquiries(INITIAL_INQUIRIES);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setPayments(INITIAL_PAYMENTS);
    setCurrentUser(INITIAL_USERS[0]);
    setComparisonVendorIds(['vendor-sainte-elisa', 'vendor-royal-decor']);
    setFavoriteVendorIds(['vendor-sainte-elisa', 'vendor-sawa-delights']);
    alert('Demo data has been reset successfully.');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        setCurrentUser,
        availableUsers,
        switchUserRole,
        login,
        logout,
        vendors,
        getVendorBySlug,
        getVendorById,
        addVendor,
        updateVendor,
        verifyVendor,
        toggleFeaturedVendor,
        categories,
        addCategory,
        toggleCategoryStatus,
        inquiries,
        submitInquiry,
        sendQuote,
        updateInquiryStatus,
        bookings,
        confirmBookingFromInquiry,
        cancelBooking,
        reviews,
        addReview,
        getReviewsByVendorId,
        comparisonVendorIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        favoriteVendorIds,
        toggleFavorite,
        isFavorite,
        vendorPlans: INITIAL_VENDOR_PLANS,
        payments,
        submitPayment,
        verifyPaymentByAdmin,
        upgradeVendorPlan,
        purchaseLeadAccess,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        auditLogs,
        currentView,
        setCurrentView,
        selectedVendorSlug,
        setSelectedVendorSlug,
        searchParams,
        setSearchParams,
        resetSearch,
        resetAllDemoData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
