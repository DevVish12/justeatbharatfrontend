# Project Architecture Overview

## Repository Layout

- `frontend/`: React + Vite customer and admin UI.
- `backend/`: Express + MySQL API for admin auth, hero, categories, menu.
- `uploads/`: Static media for hero/menu images.

## Current Runtime Architecture

- Frontend calls backend through `VITE_API_BASE_URL` (`/api` default).
- Backend initializes MySQL and auto-creates only these tables on boot:
  - `admins`
  - `hero_banners`
  - `categories`
  - `menu_items`
- No backend order/payment database initialization currently exists.

## API Surface (Implemented vs Scaffolded)

### Implemented backend APIs

- Admin Auth (prefix-protected route): register/login/me/logout/forgot/reset.
- Hero: upload/list/toggle/delete.
- Categories: public list + admin CRUD.
- Menu: public list + admin CRUD + image upload.
- Health: `/api/health`.

### Scaffolded but not implemented

- `auth` module files exist but empty.
- `order` module files exist but empty.
- `payment` module files exist but empty.
- `redis`, `rateLimit.middleware`, `auth.middleware`, `logger`, `hash`, `generateOtp` files exist but empty.

---

# Current System Summary

## 1) Current Menu Architecture

### Data model (`menu_items`)

- Core: `item_name`, `category`, descriptions, `food_type`.
- Pricing: `base_price`, `discount_price`, `tax_percent`.
- Merchandising flags: `bestseller`, `new_tag`, `recommended`.
- Availability flags:
  - `active` (global active/inactive)
  - `availability` (`Available` / `Out of Stock`)
- Customization linkage:
  - `customisable` boolean
  - `addon_ids` as JSON string in a TEXT column.

### Operational behavior

- Public menu only returns items where `active = TRUE` and `availability = 'Available'`.
- Admin menu returns all items.
- No normalized `addons` table in backend.
- No backend variants table.
- `addon_ids` are currently ID references without relational integrity enforcement.

### Frontend behavior

- Customer UI maps backend menu item fields to card/modal fields.
- Frontend still supports static fallback data from `menuData.js` if API fails.
- Menu admin uses hardcoded addon choices (UI-only list), not backend-managed addon entities.

## 2) Current Order Lifecycle

### Customer flow (real)

- User browses menu and adds items to cart in React context state.
- Cart stores `{menuItem, variant, quantity}`.
- Checkout button exists in UI, but no backend order placement is connected.

### Admin flow (mock)

- Admin order pages read/write localStorage (`taste-trekker.adminOrders.v1`).
- Status updates are localStorage mutations only.
- No backend order persistence, no payment reconciliation, no dispatch/rider integration.

### Conclusion

- There is currently no production order lifecycle on backend.

## 3) Current Pricing Calculation Flow

- Customer cart total = sum of `(variant.price or menuItem.price) * quantity` in frontend.
- Admin mock order total = localStorage utility calculation (`basePrice + selected addon prices`) \* qty.
- Backend does not currently calculate or validate order totals server-side.
- Tax and discount are stored in menu schema, but no backend checkout pricing engine exists.

## 4) Current Stock Logic

- Stock is represented by menu item-level `availability` and `active` flags.
- No real-time stock decrement/increment.
- No SKU/item-option/addon-level stock entities.
- Addon stock is not modeled.

## 5) Current Store Status Handling

- Customer store “OPEN” is hardcoded UI text in `StoreInfo`.
- No backend store operational status table or endpoint.
- No opening-hours driven availability service.

## 6) Authentication & Security Structure

- Implemented: admin JWT auth with `Bearer` token and role check.
- Implemented: password hashing (`bcryptjs`), password reset token hashing (`sha256`), login rate limiting.
- Implemented: CORS, Helmet, centralized error middleware.
- Missing for production POS integration:
  - Webhook signature verification middleware.
  - Idempotency keys for order callbacks.
  - API-level request tracing/structured logs.
  - Dedicated webhook authentication strategy.
  - Secret rotation strategy.

---

# Petpooja Compatibility Analysis

## Compatibility Score

**Medium (conceptually feasible, structurally incomplete for production).**

Reasoning:

- Menu/category admin capabilities exist and can be adapted.
- Backend order domain does not exist yet, which is mandatory for Petpooja Save Order + status callbacks.
- Addons/variants/tax abstractions are partially present but not normalized.

## Capability Matrix

### 1) Can current menu structure be replaced by Petpooja menu sync?

- **Yes, with schema refactor.**
- Current table can hold basic item fields but lacks normalized:
  - variant groups/options
  - addon groups/options
  - POS external IDs and versioning metadata.

### 2) Existing support check

- Variants: **Partial/UI-only** (frontend expects optional variants array, backend stores none).
- Addon groups: **Partial/non-normalized** (`addon_ids` only, no groups/options entity).
- Taxes: **Partial** (`tax_percent` exists per menu item).
- Discounts: **Partial** (`discount_price` exists; no campaign/coupon/order-level logic).

### 3) Is current order structure compatible with Petpooja Save Order API?

- **No (not currently).**
- No backend order payload assembler, persistence, or outbound integration.
- Admin order screens are mock data and do not represent true DB-backed order objects.

### 4) Are DB changes required?

- **Yes (significant).**
- New normalized tables required for integration-safe operations.

### 5) Are webhook endpoints already structured properly?

- **No.**
- No webhook endpoints currently implemented.
- No callback auth/signature/idempotency pipeline exists.

## Breaking Changes

1. Frontend cart price must no longer be authoritative.
2. Addon management must move from static UI to backend-managed entities.
3. Order admin pages must switch from localStorage mock to backend APIs.
4. Menu schema must include stable external IDs and mapping metadata.
5. Availability and store status need backend truth source.

## Required Modifications

- Build order domain backend (models/services/routes/controllers).
- Introduce Petpooja integration module with adapters and webhook handlers.
- Normalize menu/addon/variant schema and add mapping tables.
- Add store status and stock state domain models.
- Add robust webhook security middleware and idempotency handling.

## Risk Level

- **Overall: Medium-High**
- Highest risks:
  - Data mismatch between local menu model and POS authoritative menu.
  - Duplicate callbacks/order status race conditions.
  - Inconsistent total calculation if pricing remains frontend-driven.

## Performance Impact

- Positive if menu is cached and sync is incremental.
- Negative risk if each order/status operation does synchronous external calls without queueing/retries.
- Recommended: async event/outbox pattern for outbound POS updates.

---

# Required Changes

## Backend Endpoints to Add

## Integration control

- `POST /api/integrations/petpooja/menu/sync` (manual sync trigger)
- `GET /api/integrations/petpooja/menu/sync-status/:jobId`
- `POST /api/integrations/petpooja/menu/push` (optional if this system is master)
- `GET /api/integrations/petpooja/menu/fetch` (raw pull/testing)

## Orders

- `POST /api/orders` (customer checkout -> internal order create)
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`

## Petpooja callbacks/webhooks

- `POST /api/webhooks/petpooja/order-callback`
- `POST /api/webhooks/petpooja/order-status`
- `POST /api/webhooks/petpooja/stock-toggle`
- `POST /api/webhooks/petpooja/store-status`
- `POST /api/webhooks/petpooja/rider`

## Stock & store operations

- `PATCH /api/admin/stock/items/:id`
- `PATCH /api/admin/stock/addons/:id`
- `PATCH /api/admin/store/status`

## Middleware to Add

- `petpoojaAuth.middleware`: validates source credentials + timestamp tolerance.
- `petpoojaSignature.middleware`: HMAC signature verification.
- `idempotency.middleware`: reject/replay-safe callback handling using unique event IDs.
- `requestContext.middleware`: correlation ID per request.
- `webhookRateLimit.middleware`: tighter limits for callback endpoints.

## Database Schema Changes

- `integration_configs` (encrypted API keys/secrets, env mode, active flags).
- `menu_categories` (with `external_category_id`).
- `menu_items` enhancement:
  - `external_item_id`
  - `sync_source`
  - `last_synced_at`
- `menu_variant_groups`, `menu_variants`.
- `addon_groups`, `addons`, `item_addon_group_map`.
- `tax_profiles` + `item_tax_map` (optional but recommended).
- `orders`, `order_items`, `order_item_addons`, `order_events`.
- `stock_states` (item/addon availability with source + last update).
- `store_status`.
- `webhook_events` (dedupe + audit trail).
- `sync_jobs` (menu sync observability).

---

# New Architecture Diagram (Text based)

```text
Customer Web App
	 |
	 | 1) Browse Menu / Add Cart / Checkout
	 v
Backend API (Express)
	 |- Menu Service (DB + cache)
	 |- Order Service (pricing, tax, validation)
	 |- Stock Service
	 |- Store Status Service
	 |- Petpooja Adapter Service
	 |      |- Fetch Menu / Push Menu
	 |      |- Save Order
	 |      |- Update Order Status
	 |
	 +- Webhook Ingress
					|- Signature Verify
					|- Idempotency Check
					|- Event Processor
					|- DB Update + Async Jobs

MySQL
	 |- Menu normalized tables
	 |- Orders + events
	 |- Stock/store state
	 |- Integration configs + webhook logs

Background Worker/Queue (recommended)
	 |- Retry outbound POS calls
	 |- Dead-letter handling
	 |- Reconciliation jobs
```

---

# Database Modifications

## Minimum viable production schema delta

1. Add external mapping IDs to existing menu/category records.
2. Create normalized variants/addons tables.
3. Implement true order persistence tables.
4. Add webhook/event audit tables for traceability and replay.
5. Add store status and stock state tables.

## Migration strategy

- Phase A: additive migrations only (no destructive changes).
- Phase B: backfill legacy menu rows with generated stable IDs.
- Phase C: switch frontend/admin to normalized APIs.
- Phase D: deprecate old fields (`addon_ids` TEXT) once parity verified.

---

# API Integration Plan

## Menu Sync Strategy (Push vs Fetch)

### Recommended: **Fetch-first (Petpooja as source of truth)**

- Nightly full fetch + periodic incremental sync.
- Manual sync endpoint for operational recovery.
- Admin changes in this app should either:
  - be disabled for synced entities, or
  - write-through to Petpooja and await confirmation.

### Push use-case

- Only if this app is business source of truth.
- Requires strict change queue and conflict policy.

## Order Flow Redesign

1. Frontend sends raw cart intent to backend.
2. Backend re-resolves prices/taxes/addons from DB.
3. Backend creates internal order in `PENDING_SUBMISSION`.
4. Backend calls Petpooja Save Order.
5. On success: persist external order ID + transition to `PLACED`.
6. On failure: mark `SUBMISSION_FAILED`, retry async.
7. Status callbacks update lifecycle with idempotent event processing.

## Webhook Handling Structure

- Ingress route -> auth/signature validation -> schema validation.
- Save raw payload hash + event key.
- Reject duplicates if event already processed.
- Dispatch to event-specific handlers.
- Persist state transition + publish internal notifications.

## Stock Sync Logic

- Item/addon stock toggle callbacks update `stock_states`.
- Admin stock changes emit outbound update request to Petpooja.
- Reconciliation job detects drift and resolves conflicts by source policy.

## Store Status Sync Logic

- Store status callback updates `store_status` table.
- Customer menu endpoint checks `store_status` before exposing items.
- Admin UI shows both local status and Petpooja status timestamp.

---

# Order Lifecycle After Integration

```text
CART_CREATED (frontend)
 -> CHECKOUT_REQUESTED
 -> PENDING_VALIDATION
 -> PENDING_SUBMISSION
 -> PLACED (external order_id assigned)
 -> ACCEPTED/REJECTED
 -> PREPARING
 -> READY
 -> OUT_FOR_DELIVERY (if applicable)
 -> DELIVERED / CANCELLED
```

Rules:

- All transitions server-side only.
- All callback-driven transitions idempotent.
- Invalid regressions blocked (e.g., DELIVERED -> PREPARING).

---

# Security Checklist

- [ ] Store Petpooja credentials encrypted at rest.
- [ ] Verify webhook signatures with rotating secrets.
- [ ] Apply strict request schema validation (Zod/Joi) on all integration routes.
- [ ] Enforce idempotency keys for callbacks and outbound retries.
- [ ] Use correlation IDs in logs for end-to-end tracing.
- [ ] Use role-based admin authorization for sync/stock/store operations.
- [ ] Remove frontend-authoritative price assumptions.
- [ ] Add audit logs for status changes and stock toggles.
- [ ] Add replay window check for timestamped webhook signatures.

---

# Risk Assessment

## Top Risks

1. **Data drift risk** between local DB and POS menu/stock.
2. **Order duplication risk** from repeated callbacks/network retries.
3. **Financial mismatch risk** if taxes/discounts not centrally recomputed.
4. **Operational outage risk** if external POS calls are synchronous and blocking.

## Mitigations

- Idempotency table + unique constraints on external event IDs.
- Async retry queue with exponential backoff + dead-letter queue.
- Reconciliation jobs for menu/stock/order status.
- Server-side canonical pricing service.

---

# Deployment Strategy

## Staging vs Production

### Staging

- Separate Petpooja sandbox credentials.
- Isolated webhook endpoints and DB.
- Seed test menus/orders and verify full callback loop.
- Chaos tests for timeout/retry/idempotency.

### Production

- Feature flags:
  - `PETPOOJA_MENU_SYNC_ENABLED`
  - `PETPOOJA_ORDER_SUBMIT_ENABLED`
  - `PETPOOJA_WEBHOOK_ENABLED`
- Blue/green or canary rollout for order submission path.
- Observability dashboards for:
  - webhook success/failure rate
  - order submit latency
  - retry queue depth
  - stock drift count

---

# Development Roadmap

## Step 1 – Build backend order domain

- Complexity: High
- Deliverables: order tables, order APIs, server-side pricing/tax calculation, status machine.
- Risk area: schema correctness and transition rules.

## Step 2 – Normalize menu/addon/variant schema

- Complexity: High
- Deliverables: addon groups/options, variant groups/options, mappings, migrations.
- Risk area: backward compatibility with existing admin pages.

## Step 3 – Implement Petpooja adapter module

- Complexity: High
- Deliverables: API client, auth/signature, retry policies, timeout controls.
- Risk area: API contract mismatch and edge-case payload mapping.

## Step 4 – Implement webhook ingress pipeline

- Complexity: Medium-High
- Deliverables: verification middleware, idempotency, event dispatchers.
- Risk area: duplicate or out-of-order events.

## Step 5 – Stock/store synchronization

- Complexity: Medium
- Deliverables: stock/store tables, admin APIs, sync jobs.
- Risk area: source-of-truth conflicts.

## Step 6 – Frontend migration

- Complexity: Medium
- Deliverables:
  - Replace localStorage order admin with backend order APIs.
  - Replace static addon management with backend-driven addon entities.
  - Checkout to call backend order create endpoint.
- Risk area: UX regressions during transition.

## Step 7 – Non-functional hardening

- Complexity: Medium
- Deliverables: structured logging, metrics, alerts, runbooks, load tests.
- Risk area: missing observability in incident scenarios.

## Step 8 – Pilot and phased rollout

- Complexity: Medium
- Deliverables: staged rollout, reconciliation reports, rollback plan.
- Risk area: live data parity issues.

---

# Performance & Security Review

## API Rate Limit Handling

- Keep existing login limiter.
- Add stricter limits on webhook endpoints with provider allowlist if possible.
- Use separate limiter buckets for admin, customer, webhook traffic.

## Timeout Handling

- Outbound Petpooja calls should use conservative timeout (e.g., 3–8s configurable).
- Never block user request thread indefinitely on third-party response.

## Retry Mechanism

- Retry only safe/idempotent operations automatically.
- For Save Order: retry with idempotency token + state lock.
- Exponential backoff + max attempts + dead-letter event for manual ops.

## Data Validation

- Validate all integration payloads at boundary layer.
- Reject malformed enums, missing IDs, and impossible numeric values.
- Store original payload for forensic debugging.

## Signature Verification

- Mandatory HMAC verification using shared secret.
- Compare signatures with constant-time comparison.
- Enforce timestamp freshness window to prevent replay.

## Callback Authentication

- Combine signature validation + optional static token header.
- Keep IP allowlist optional (defense-in-depth).

## Failure Fallback System

- If POS unavailable:
  - Accept internal order as `SUBMISSION_PENDING`.
  - Return user-safe acknowledgement.
  - Retry async and notify admin if prolonged failure.
- Add reconciliation endpoint to replay failed submissions safely.

---

# Final Recommendation

Petpooja integration is **possible and recommended**, but this project is currently in a **menu-management stage**, not yet a full production ordering backend.

The shortest safe path to production is:

1. Implement backend order domain and normalized menu customization schema.
2. Introduce Petpooja adapter + secure webhooks with idempotency.
3. Migrate admin order/addon flows from frontend mock state to backend APIs.
4. Roll out with staged feature flags and reconciliation monitoring.

**Go-live readiness today for Petpooja order integration: Not Ready.**

**Projected readiness after roadmap execution: High confidence.**
