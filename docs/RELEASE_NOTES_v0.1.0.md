# Release v0.1.0

## Overview
- End-to-end ordering flow implemented with Stripe + Supabase
- Frontend Checkout integrated with Stripe Elements; real Confirmation page
- Admin enhancements: AI description generation, CSV import, bulk image upload; Admin Tools route

## Backend
- Orders API: `POST /api/orders`, `GET /api/orders/:id`
- Stripe webhook updates order to `paid` + `processing` on `payment_intent.succeeded`
- Route mounts and health endpoints

## Frontend
- Checkout connects to `POST /api/orders` and renders Stripe `PaymentElement`
- Confirmation fetches order by `id` and displays items/totals
- Admin Products: AI generation button, CSV import, bulk image upload
- Admin Settings: AI provider/model/defaults + agent management

## Env
- Backend `.env` requires: `PORT`, `ADMIN_API_TOKEN`, `ADMIN_JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Testing
- Start backend `PORT=4000 npm run dev` and frontend `npm run dev` in `jewelry`
- Checkout → Continue to Payment → Stripe test card → redirect to Confirmation
- Use Stripe CLI to forward webhooks to `/api/stripe/webhook`

## Risks
- Requires valid Stripe + Supabase credentials; webhook secret must be configured
