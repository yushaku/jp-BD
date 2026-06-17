# JP Bùi Đặng — Next.js Storefront

Headless frontend cho WordPress + WooCommerce.

## Stack

- **Next.js** App Router
- **shadcn/ui** (base-nova) — `components/ui/`
- **TanStack Query** — cart + client mutations
- **pnpm**

## Dev

```bash
cp .env.local.example .env.local
# Điền WC_CONSUMER_KEY / WC_CONSUMER_SECRET

pnpm install
pnpm dev
```

Mở http://localhost:3000

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Chạy build |
| `pnpm lint` | ESLint |

## Thêm shadcn component

```bash
pnpm dlx shadcn@latest add <component>
```

## TanStack Query

- Provider: `components/providers.tsx`
- Query keys: `lib/query-keys.ts`
- Cart hooks: `hooks/use-cart.ts`

Server Components vẫn fetch qua `lib/woocommerce.ts` (ISR). Client cart dùng Store API + React Query.
