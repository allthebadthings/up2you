## Goal
Add a "Generate with AI" button to the admin product editor and provide admin settings to add/change AI provider API keys and agent profiles used for generation.

## Backend: AI Config
- Use existing config endpoints: `GET/POST /api/admin/config/:service`.
- Define `service = "ai"` schema stored via `configService`:
  - `provider`: "openai" (default), future: "anthropic", "groq".
  - `apiKey`: provider key (sensitive; only in admin config storage).
  - `model`: default model (e.g., `gpt-4o-mini`).
  - `defaults`: `{ tone: "neutral", language: "en", maxLength: 150 }`.
  - `agents`: array of `{ id, name, systemPrompt, temperature?, maxTokens?, language? }`.
  - `is_active`: boolean to toggle usage.
- Validation: server-side schema validation; never expose `apiKey` via public routes.

## Backend: Generate Endpoint
- Add `POST /api/admin/products/:id/generate-description` under existing `adminRoutes` and `requireAdmin`.
- Request body: `{ agentId?: string, tone?: string, language?: string, keywords?: string[] }`.
- Flow:
  - Fetch product by `id` using existing DB/in-memory path.
  - Load AI config via `configService.get('ai')`; if inactive or missing key, use safe fallback.
  - Build prompt using selected agent's `systemPrompt` + product facts (name, materials, price range, stock, bundle, images) and requested options.
  - Call provider client (OpenAI by default) and return `{ description }`.
  - Do not persist; let UI patch after review.

## Backend: AI Service Module
- `backend/src/services/ai.ts`:
  - `generateProductDescription(product, options, aiConfig)` that abstracts provider selection.
  - Providers: OpenAI first; clean output (length clamp, strip HTML, enforce brand-neutral).
  - Fallback (no key): deterministic templated description so feature works in dev/demo.

## Admin UI: Settings for AI
- Add a new Settings page or drawer under `/admin` (e.g., "Settings → AI") using existing AdminGuard.
- UI fields:
  - Provider select (OpenAI for v1).
  - API Key input (store via `POST /api/admin/config/ai`).
  - Model select (defaults sensible).
  - Defaults (tone, language, max length).
  - Agents list: CRUD for `{ name, systemPrompt, temperature, maxTokens }`.
- Fetch/save using existing config APIs with `x-admin-token` header.
- Hide the API key on load; allow replace without revealing stored value.

## Admin UI: Product Editor Button
- In `jewelry/src/pages/admin/Products.tsx`, add "Generate with AI" button next to Description.
- Options: select agent (from `GET /api/admin/config/ai`), tone, language, keywords.
- On click: call `POST /api/admin/products/:id/generate-description`; show loading; populate description field with response.
- Keep existing save flow (PATCH) unchanged; admin can edit before saving.

## Security & Storage
- Keys persist via `configService` (Supabase `integrations` table if configured; otherwise in-memory for dev).
- Endpoint is admin-only; never echo keys in responses.
- Audit logs (basic): log agent usage and errors server-side.

## Validation
- Unit tests: config validation, endpoint behavior (mock provider), agent selection.
- Manual: set provider/key/agent in Settings; open a product; generate; review; save.
- Fallback path verified when no key present.

## Rollout
- Implement backend config + service + endpoint first.
- Then ship admin Settings UI and product editor button.
- Document env considerations; but keys live in admin config for runtime changes without redeploy.