## Backend plan for Gearbox Autos

Enable Lovable Cloud and add a database-backed backend covering car inventory, sell-car leads, test-drive bookings, and contact inquiries. Admin access via Google sign-in, gated by a roles table.

### Database schema

**cars** — public-readable inventory
- id (uuid, pk), slug (text, unique), name, price_inr (bigint), year (int), km (int), rto, location, fuel, transmission, image_url, features (text[]), description, is_active (bool), created_at

**sell_leads** — submissions from /sell
- id, full_name, phone, email, city, car_model, year, km, created_at

**test_drive_bookings** — submissions from /car/$id
- id, car_id (fk → cars), full_name, phone, preferred_date, message, created_at

**contact_messages** — submissions from /contact
- id, full_name, phone, email, subject, message, created_at

**user_roles** — separate roles table (admin, user) with `has_role()` security-definer function (per security best practices, never store roles on profiles)

### RLS policies
- `cars`: public SELECT where `is_active = true`; admins full CRUD
- All lead/booking/message tables: public INSERT (anyone can submit); only admins can SELECT/UPDATE/DELETE
- `user_roles`: only admins can manage; users can read their own

### Auth
- Google sign-in via Lovable broker (`lovable.auth.signInWithOAuth("google")`)
- Configure Google provider on Supabase
- `/login` route for admin
- `_authenticated` layout + admin role check for `/admin/*`

### Server functions (createServerFn)
- `listPublicCars`, `getCarBySlug` — public, use `supabaseAdmin` scoped by `is_active`
- `submitSellLead`, `submitTestDrive`, `submitContact` — public inserts with Zod validation
- `adminListCars`, `adminUpsertCar`, `adminDeleteCar`, `adminListLeads`, `adminListBookings`, `adminListMessages` — protected by `requireSupabaseAuth` + `has_role(uid, 'admin')` check

### Admin panel routes (`/admin/*`, gated)
- `/admin` — dashboard with counts
- `/admin/cars` — list, create, edit, delete car listings (image URL field)
- `/admin/leads` — view sell-car leads
- `/admin/bookings` — view test-drive bookings
- `/admin/messages` — view contact messages

### Frontend wiring
- Replace hardcoded `src/lib/cars.ts` data with queries to `listPublicCars` / `getCarBySlug` (keep type)
- Wire `sell.tsx`, `contact.tsx`, `car.$id.tsx` forms to their submit server fns with toast feedback and Zod validation
- Seed initial 5 cars (XUV500, Creta, Fortuner, Dzire, Verna) via migration insert using existing bundled images uploaded to Supabase storage OR keep image asset paths as URLs in DB
- Add "Admin" link in footer; show "Sign out" when logged in as admin

### Admin bootstrap
After first Google sign-in, you'll need to manually assign admin role to your user via a one-time SQL insert into `user_roles`. I'll include the exact SQL snippet to run.

### Out of scope
- No email notifications (per your choice)
- No file upload UI — admin pastes image URLs for now (can add storage upload later)