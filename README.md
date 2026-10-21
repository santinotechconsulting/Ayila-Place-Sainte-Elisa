# AYILA'A | PLACE SAINTE ELISA
## Wedding & Event Vendor Marketplace — Cameroon (Douala)

Ayila'a is Cameroon's premier online marketplace where couples, families, businesses, and event planners discover, compare, contact, and book verified wedding and event professionals, launching initially in Douala with expansion to Yaoundé, Buea, Limbe, and nationwide.

---

### Key Features Implemented

1. **Cameroon-Specific Localization**:
   - Official currency: Central African CFA Franc (**XAF / FCFA**) formatted with Cameroon conventions.
   - Initial operational focus: **Douala** (Bonanjo, Akwa, Bonapriso, Makepe, Denver, Yassa, Bali, Kotto, Deido, Bonamoussadi).
   - Phone formatting and validation with Cameroon country code **+237**.
   - Complete bilingual support (**Français / English**) with instant one-click toggle.

2. **15 Searchable Vendor Categories**:
   - Wedding venues and reception halls (Spotlight on *Place Sainte Elisa* estate)
   - Event decorators and florists (Royal Scénographie)
   - Catering services and wedding cakes (Sawa Gourmet)
   - Photographers and videographers (Lumina Films)
   - DJs, live bands, and sound services (Krystal Sound)
   - Makeup artists and hairstylists (Glamour Bridal)
   - Masters of ceremony (MCs)
   - Wedding planners and event coordinators
   - Bridal boutiques, wedding dresses, and suits
   - Equipment, chairs, tables, tents, lighting, and stage rentals
   - Transportation and luxury wedding cars (Mercedes Classe S cortèges)
   - Invitations, printing, and event stationery
   - Ushers, waiters, and event staffing
   - Traditional wedding services (Royal Toghu, Ndop, Sawa dowry customs)
   - Other event-related services (special effects, 360 video booths)

3. **Four Target Account Types & Testing Switcher**:
   - **Customers / Couples**: Browse, filter, save favorites, submit inquiries, review quotes, confirm bookings, compare up to 4 vendors.
   - **Vendors**: Manage public profile, define packages in XAF, block unavailable dates, review incoming leads, send tailored quotes, upgrade subscription tiers.
   - **Platform Administrators**: Overview business metrics, approve/verify vendors, inspect payment transactions, view audit logs, reset demo data.
   - **Event Planners**: Curate vendor shortlists, compare side-by-side matrices, track milestones.
   - *A role selector is integrated in the top utility bar to allow instantaneous testing of any account perspective.*

4. **Monetization & Cameroon Mobile Money Integration**:
   - Free Basic Listing (0 FCFA)
   - Starter Pro (15,000 FCFA / month)
   - Elite Commercial Pro (35,000 FCFA / month)
   - Featured Sponsor (60,000 FCFA / month)
   - Paid leads at 5,000 FCFA per qualified inquiry
   - Payment adapter supporting **MTN Mobile Money (*126#)** and **Orange Money (#150#)** with transaction references and administrative validation.

5. **Inquiry & Booking Lifecycle**:
   `New Inquiry` ➔ `Awaiting Response` ➔ `Quote Received` ➔ `Negotiation` ➔ `Confirmed Booking` ➔ `Completed`.

---

### Database Architecture & Migrations

The schema contains 21 core relational models implemented in `src/types/index.ts` and managed via the reactive persistent store in `src/services/store.tsx`:
- `users`: ID, full name, email, phone (+237), role, language.
- `vendors`: ID, slug, business name, category, neighborhood, starting price in XAF, availability, verification status.
- `categories`: Bilingual labels, icons, display order.
- `vendor_packages`: Pricing in XAF, inclusions, exclusions.
- `inquiries`: Event type, date, location in Douala, budget range, guest count, requirements.
- `quotes`: Proposed amount, formal terms, validity deadline.
- `bookings`: Final agreed amount, event date, confirmation timestamp.
- `reviews`: Customer rating 1-5, verified badge check, review commentary.
- `payments`: Provider (MTN MoMo, Orange Money), reference, status (verified/pending).
- `audit_logs`: Actor, action, entity type, timestamp.

---

### Production Launch Checklist

- [x] Responsive layout tested for mobile Android screens and desktop browsers.
- [x] Zero-pill typographic discipline & anti-slop guidelines enforced.
- [x] High-fidelity visual assets generated and embedded with dark scrim overlays.
- [x] Tabular figures applied to all XAF currency and statistical metrics.
- [x] Role-based access control and state persistence across page refreshes.
- [x] Cameroon phone validation (+237 6XX XX XX XX).
- [ ] Connect production Supabase / Cloud SQL PostgreSQL credentials when ready.
- [ ] Link production MTN Mobile Money & Orange Money Cameroon Merchant API keys.
