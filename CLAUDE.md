# CLAUDE.md — G.Era Merchandise Store

## 🚀 Build & Development

| Command                                                  | Action                                            |
| :------------------------------------------------------- | :------------------------------------------------ |
| `npm run dev`                                            | Starts Next.js local development (localhost:3000) |
| `npm run build`                                          | Creates production build                          |
| `npm run lint`                                           | Runs ESLint for code quality                      |
| `npm run type-check`                                     | Runs TypeScript compiler check                    |
| `stripe listen --forward-to localhost:3000/api/webhooks` | Local webhook testing                             |

---

## 🛠 Tech Stack & Architecture

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Payments:** Stripe (Checkout Sessions + Webhooks)
- **Styling:** Tailwind CSS
- **State:** Zustand (Cart & UI State)
- **Icons:** Lucide React

### Folder Structure

- `@/app/api/checkout`: Stripe session creation.
- `@/app/api/webhooks`: Secure payment verification logic.
- `@/components/ui`: Atomic, reusable sharp-edged components.
- `@/lib/stripe.ts`: Stripe SDK configuration.
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

> **CRITICAL:** Never trust the "Price" sent from the frontend. Always fetch the price from your database or Stripe using a `priceId` during the checkout creation on the server.

- **Currency Math:** All money must be handled as **integers in cents** (e.g., **$15.00** is `1500`) to avoid floating-point errors.
- **Webhooks:** Every webhook handler must implement `stripe.webhooks.constructEvent` to verify the signature before fulfilling orders.
- **Inventory:** Validate stock levels in the server-side checkout route before redirecting to Stripe.
- **Imagery:** Use high-contrast black and white photography for lifestyle shots; keep product-only shots in full color to highlight the "Bling" details (Gold/Yellow).

---

## 📦 Fulfillment Logic

1.  User clicks "Checkout" → Call `/api/checkout`.
2.  Server creates Stripe Session using Server-Side pricing → Redirects user.
3.  User pays on Stripe's secure domain.
4.  Stripe sends `checkout.session.completed` to `/api/webhooks`.
5.  Server verifies signature → Updates database → Triggers shipping/email.

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
