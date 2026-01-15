# Ordering System Roadmap (Stripe + Supabase)

## Phase 1 — Backend Core & Database
- Implement `POST /api/orders` in backend/src/routes/orders.ts
  - Validate cart + shipping, compute totals (subtotal, discount, tax, shipping, total)
  - Create Stripe PaymentIntent for `total` (cents) and insert `orders` + `order_items` (status: pending, payment_status: pending)
  - Return `{ orderId, orderNumber, clientSecret }`
- Extend webhook in backend/src/routes/stripe.ts to update order on `payment_intent.succeeded` and `payment_intent.payment_failed`
- Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Phase 2 — Frontend Checkout Integration
- Add `@stripe/stripe-js` and `@stripe/react-stripe-js`; wrap Checkout with `Elements`
- Replace dummy submit with: call `POST /api/orders`, then `stripe.confirmPayment({ clientSecret })`
- On success: clear cart, route to `/confirmation?order=<orderNumber>`; fetch order summary via `GET /api/orders/:id`

## Phase 3 — Admin Order Management
- Admin endpoints in backend/src/routes/admin/index.ts: `GET /api/admin/orders`, `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status`
- Admin UI pages: jewelry/src/pages/admin/Orders.tsx (+ optional OrderDetail.tsx)

## Phase 4 — Polish & Verification
- E2E tests with Stripe Test Mode; price validation; idempotent webhook; basic refunds stub
- RLS policies to scope order reads; optional stock decrement

## References
- [stripe.ts](file:///Users/kevin/Workspace/Projects/Active/lab-projects/workbench/up2you/backend/src/routes/stripe.ts)
- [index.ts](file:///Users/kevin/Workspace/Projects/Active/lab-projects/workbench/up2you/backend/src/index.ts)
- [Checkout.tsx](file:///Users/kevin/Workspace/Projects/Active/lab-projects/workbench/up2you/jewelry/src/pages/Checkout.tsx)
- [002_create_orders.sql](file:///Users/kevin/Workspace/Projects/Active/lab-projects/workbench/up2you/supabase/migrations/002_create_orders.sql)

