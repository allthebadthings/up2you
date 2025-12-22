## Overview
- Sync your Shopify products into the site’s primary product store (Supabase) so the storefront and Admin reflect live Shopify data.
- Uses secure server-side access; no secrets in the frontend.

## What Will Be Synced
- Products: title, description, price, SKU, images, inventory, type → mapped to our fields
- De-duplication: Upsert by `sku`
- Not included (initial): orders, customers, variants beyond base mapping

## Requirements
- Backend `.env` or Admin config holds:
  - `SHOPIFY_SHOP_DOMAIN`
  - `SHOPIFY_ACCESS_TOKEN`
  - `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` (optional)
- Supabase is configured (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- Admin token (`ADMIN_API_TOKEN`) for protected endpoints

## Backend Endpoints
1. `POST /api/admin/config/shopify`
   - Body: `{ config: { shopDomain, accessToken, apiKey, apiSecret }, is_active: true }`
   - Stores/activates Shopify settings (fallback to `.env` if preferred)
2. `POST /api/admin/shopify/import`
   - Imports products from Shopify and upserts into Supabase by `sku`
   - Returns `{ imported: N }`

## Frontend Admin UI
- Add “Sync Shopify” button on `/admin/products`:
  - Calls `POST /api/admin/shopify/import` with `x-admin-token`
  - Shows progress/success count and any errors

## Field Mapping
- Shopify `title` → `name`
- `body_html` (stripped) → `description`
- First variant price → `price`
- `product_type` → `category`
- Images array → `images`
- First variant `sku` → `sku`
- Inventory sum over variants → `stock_quantity`

## Error Handling & Logs
- Return clear errors for auth/config issues
- Log rate limits or API errors; show a concise message in Admin UI

## Verification
- Admin: `/api/admin/products` shows items
- Storefront: `/catalog` lists imported products
- Shopify config check: `/api/shopify/config`

## Scheduling (Optional)
- Add cron (hourly): `curl -X POST /api/admin/shopify/import -H x-admin-token:...`
- Or nightly (off-peak) to reduce API load

## Security
- Keep Shopify tokens only in server `.env` or Admin config
- Do not commit secrets

## Next Steps
- Implement frontend “Sync Shopify” button and status UI
- Confirm environment values and run one manual import
- Validate storefront and Admin lists match Shopify catalog

Confirm this plan and I’ll implement the Admin UI button, wire endpoints, and provide the exact server-side commands to run the initial import and optional cron.