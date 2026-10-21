export type UserRole = 'customer' | 'vendor' | 'admin' | 'event_planner';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string; // Cameroon (+237)
  preferredLanguage: 'fr' | 'en';
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type PricingType = 'starting_at' | 'fixed' | 'request_quote';

export interface VendorPackage {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  priceXaf: number;
  inclusions: string[];
  exclusions: string[];
  active: boolean;
}

export interface VendorService {
  id: string;
  vendorId: string;
  categoryId: string;
  title: string;
  description: string;
  startingPriceXaf: number;
  pricingType: PricingType;
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  vendorId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  displayOrder: number;
}

export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'rejected';
export type ListingStatus = 'active' | 'paused' | 'suspended';

export interface Vendor {
  id: string;
  ownerUserId: string;
  businessName: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  primaryCategoryId: string;
  city: string; // Douala, Yaoundé, Buea, Limbe, etc.
  neighborhood: string; // e.g. Bonanjo, Akwa, Bonapriso, Makepe, Bali, etc.
  serviceAreas: string[];
  startingPriceXaf: number;
  pricingType: PricingType;
  verificationStatus: VerificationStatus;
  listingStatus: ListingStatus;
  featured: boolean;
  featuredExpiry?: string;
  planId: 'free' | 'starter' | 'pro' | 'featured';
  rating: number;
  reviewCount: number;
  responseTimeHours: number;
  bookingRequirements: string;
  cancellationPolicy: string;
  phone: string;
  email: string;
  whatsapp: string;
  website?: string;
  instagram?: string;
  unavailableDates: string[]; // YYYY-MM-DD
  packages: VendorPackage[];
  services: VendorService[];
  portfolio: PortfolioItem[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  iconName: string;
  active: boolean;
  displayOrder: number;
}

export type InquiryStatus = 
  | 'new'
  | 'awaiting_vendor_response'
  | 'quote_received'
  | 'negotiation'
  | 'accepted'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'declined';

export interface Inquiry {
  id: string;
  customerUserId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vendorId: string;
  vendorName: string;
  eventType: string; // Mariage Civil, Mariage Traditionnel, Soirée Privée, Gala, etc.
  eventDate: string;
  eventLocation: string; // Douala - Bonanjo, etc.
  guestCount?: number;
  budgetMinXaf: number;
  budgetMaxXaf: number;
  requirements: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  status: InquiryStatus;
  createdAt: string;
  quote?: Quote;
}

export interface Quote {
  id: string;
  inquiryId: string;
  vendorId: string;
  amountXaf: number;
  inclusions: string[];
  exclusions: string[];
  terms: string;
  validUntil: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  inquiryId: string;
  customerUserId: string;
  vendorId: string;
  agreedAmountXaf: number;
  eventDate: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  confirmationTimestamp: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerUserId: string;
  customerName: string;
  vendorId: string;
  bookingId?: string;
  rating: number; // 1-5
  reviewText: string;
  verified: boolean;
  createdAt: string;
}

export interface VendorPlan {
  id: 'free' | 'starter' | 'pro' | 'featured';
  nameEn: string;
  nameFr: string;
  priceXaf: number;
  billingPeriod: 'month' | 'year';
  descriptionEn: string;
  descriptionFr: string;
  featuresEn: string[];
  featuresFr: string[];
  isPopular?: boolean;
}

export type PaymentProvider = 'mtn_momo' | 'orange_money' | 'bank_transfer' | 'cash_agency';
export type PaymentPurpose = 'subscription' | 'featured_listing' | 'lead_purchase' | 'event_deposit';
export type PaymentStatus = 'pending' | 'verified' | 'failed';

export interface Payment {
  id: string;
  payerUserId: string;
  vendorId?: string;
  amountXaf: number;
  paymentProvider: PaymentProvider;
  transactionReference: string;
  payerPhone: string;
  paymentPurpose: PaymentPurpose;
  status: PaymentStatus;
  verifiedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface LeadPurchase {
  id: string;
  vendorId: string;
  inquiryId: string;
  amountXaf: number;
  accessStatus: 'unlocked' | 'refunded';
  createdAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  type: 'inquiry' | 'quote' | 'booking' | 'verification' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  reportedVendorId: string;
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}
