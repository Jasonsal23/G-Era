# CLAUDE.md — G.Era Merchandise Store

## 🚀 Build & Development

| Command                                                  | Action                                            |
| :------------------------------------------------------- | :------------------------------------------------ |
| `npm run dev`                                            | Starts Next.js local development (localhost:3000) |
| `npm run build`                                          | Creates production build                          |
| `npm run lint`                                           | Runs ESLint for code quality                      |
| `npm run type-check`                                     | Runs TypeScript compiler check                    |
| `ngrok http 3000`                                         | Tunnel for local Square webhook testing (see below) |

---

## 🛠 Tech Stack & Architecture

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Payments:** Square (Payment Links + Webhooks)
- **Styling:** Tailwind CSS
- **State:** Zustand (Cart & UI State)
- **Icons:** Lucide React

### Folder Structure

- `@/app/api/checkout`: Square Payment Link creation.
- `@/app/api/webhooks`: Secure payment verification logic.
- `@/components/ui`: Atomic, reusable sharp-edged components.
- `@/lib/square.ts`: Square SDK configuration.
- `@/lib/shipping.ts`: Shared shipping rate definitions (used by both client cart UI and the server checkout route).
- `@/types`: Shared TypeScript interfaces (`Product`, `Order`, `CartItem`).

---

## 🎨 UI & Design System (Editorial Luxe)

**Theme:** "G.Era" Minimalist Editorial. High-contrast, sharp, and expensive.

| Element             | Specification                                                            |
| :------------------ | :----------------------------------------------------------------------- |
| **Primary Palette** | Black (`#000000`) and White (`#FFFFFF`)                                  |
| **Accent Color**    | Gold (`#D4AF37`) — _Use only for high-intent actions like "Add to Cart"_ |
| **Typography**      | Headings: Ultra-Bold Condensed Sans-Serif. Body: Technical Monospace.    |
| **Border Radius**   | `rounded-none` (Strictly 90-degree sharp corners)                        |
| **Buttons**         | 2px solid borders; Invert colors on hover.                               |

---

## ⚖️ Coding Standards

- **Components:** Functional components only; use `const` and arrow functions.
- **Naming:** `PascalCase` for components; `kebab-case` for file names.
- **TypeScript:** **Zero use of `any`.** All props and API responses must have interfaces.
- **Data Fetching:** Prefer Server Components for product lists; use Client Components for interactive cart elements.

---

## 🔐 Security & E-commerce Rules

> **CRITICAL:** Never trust the "Price" (or shipping cost) sent from the frontend. Always resolve it server-side — look up the product by `productId` via `getProductById()` and the shipping cost via `SHIPPING_RATES[shippingMethod]` — during checkout creation.

- **Currency Math:** All money must be handled as **integers in cents** (e.g., **$15.00** is `1500`) to avoid floating-point errors.
- **Webhooks:** Every webhook handler must verify the signature via `WebhooksHelper.verifySignature` (HMAC-SHA256 over the notification URL + raw body) before fulfilling orders.
- **Inventory:** Validate stock levels in the server-side checkout route before redirecting to Square.
- **Imagery:** Use high-contrast black and white photography for lifestyle shots; keep product-only shots in full color to highlight the "Bling" details (Gold/Yellow).

---

## 📦 Fulfillment Logic

1.  User picks a shipping method and clicks "Checkout" → Call `/api/checkout`.
2.  Server creates a Square Payment Link using server-side pricing → Redirects user.
3.  User pays on Square's secure hosted checkout page.
4.  Square sends `payment.updated` (status `COMPLETED`) to `/api/webhooks`.
5.  Server verifies signature → Decrements inventory in Supabase.

**Known gaps (flagged at Stripe→Square migration, not yet resolved):**
- Tax is a single flat rate (`SQUARE_TAX_RATE_PERCENT`), not automatic jurisdiction-based calculation.
- No promo/discount code support on the hosted checkout page.

---

## 🔮 Future Features

### Timed Product Drops
A planned feature to release merchandise at specific dates/times.

**Implementation approach when ready:**
- Add fields to `Product` type: `dropDate`, `dropEndDate`, `maxQuantity`
- Create countdown timer component for pre-drop display
- Server-side validation in `/api/checkout` to enforce drop windows
- "Coming Soon" state for product cards before drop date
- Optional: Queue system for high-demand drops
