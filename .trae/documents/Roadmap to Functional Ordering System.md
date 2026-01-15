# Gameplay Roadmap: Functional Ordering System

This roadmap outlines the steps to take the ordering system from a UI shell to a fully functional e-commerce flow using Stripe and Supabase.

## Phase 1: Backend Core & Database
**Goal:** Enable order creation and payment status tracking.

1.  **Order API (`POST /api/orders`)**
    *   Create `backend/src/routes/orders.ts`.
    *   Implement `createOrder` endpoint:
        *   Accepts cart items and shipping details.
        *   Calculates totals (subtotal, tax, shipping, bundle discount) on the server (for security).
        *   Creates a Stripe `PaymentIntent`.
        *   Inserts record into `orders` table (status: `pending`, payment: `pending`) with the `payment_intent_id`.
        *   Inserts records into `order_items`.
        *   Returns `clientSecret` and `orderId` to the frontend.

2.  **Stripe Webhook Handling**
    *   Update `backend/src/routes/stripe.ts`:
        *   Listen for `payment_intent.succeeded`.
        *   Look up the order by `payment_intent_id`.
        *   Update `orders` table: set `payment_status` to `paid` and `status` to `processing`.

## Phase 2: Frontend Checkout Integration
**Goal:** Connect the Checkout UI to the backend and process real payments.

1.  **Stripe Elements Integration**
    *   Install `@stripe/stripe-js` and `@stripe/react-stripe-js` in `jewelry` package.
    *   Wrap `Checkout` component with `Elements` provider.
    *   Replace the current dummy form handling with:
        *   Call `POST /api/orders` to get `clientSecret`.
        *   Use `stripe.confirmPayment` to process the card.

2.  **Success Flow**
    *   Handle successful payment:
        *   Clear the cart store.
        *   Redirect to `/confirmation` with the real `orderId`.
    *   Update `Confirmation` page to fetch and display real order details from the backend using the `orderId`.

## Phase 3: Admin Order Management
**Goal:** Allow admins to view and manage incoming orders.

1.  **Admin Order API**
    *   Update `backend/src/routes/admin/index.ts`:
        *   Implement `GET /api/admin/orders` (list all orders with pagination/sorting).
        *   Implement `GET /api/admin/orders/:id` (get single order details with items).
        *   Implement `PATCH /api/admin/orders/:id/status` (update status to `shipped`, `delivered`, etc.).

2.  **Admin Dashboard UI**
    *   Create `jewelry/src/pages/admin/Orders.tsx`:
        *   Table view of orders (ID, Customer, Total, Status, Date).
        *   Status badges (Paid/Pending, Processing/Shipped).
    *   Create `jewelry/src/pages/admin/OrderDetail.tsx` (optional but recommended):
        *   View full shipping address and line items.
        *   Controls to update order status.

## Phase 4: Polish & Verification
1.  **Testing**: Perform end-to-end test with Stripe Test Mode cards.
2.  **Validation**: Ensure stock is decremented (optional complexity for now).
3.  **Security**: Verify Row Level Security (RLS) policies allow users to see only their orders.

---
## Recommended Immediate Next Steps (The "Gameplay")

I recommend we start with **Phase 1 & 2** in parallel to get the "Happy Path" working.

1.  Install Stripe dependencies in frontend.
2.  Implement the backend `POST /api/orders` endpoint.
3.  Wire up the frontend Checkout form to call it.
