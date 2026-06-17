# SPEC — cart

## §G

guest add product → cart & view own cart on Next.js storefront (Woo Store API + `Cart-Token`)

## §C

- headless: Next.js :3000 → WP :8080 WooCommerce Store API
- cart identity: `Cart-Token` header + `localStorage` key `wc_cart_token`
- client state: TanStack Query (`hooks/use-cart.ts`, `lib/query-keys.ts`)
- UI: shadcn/ui, Vietnamese copy, VND via `formatPrice`
- checkout out of scope here — cart page may link to existing handoff (`/checkout`)
- page-local rule: cart-only UI → `app/cart/components/` if single-route; shared → `frontend/components/`

## §I

```
route: /cart → cart page, `CartView`
route: /product/[slug] → add button
route: /shop, /category/[slug] → add on product cards

api: GET  /wp-json/wc/store/v1/cart → `StoreCart`
api: POST /wp-json/wc/store/v1/cart/add-item → body `{id:number, quantity:number}` → `StoreCart`
api: POST /wp-json/wc/store/v1/cart/update-item → body `{key:string, quantity:number}` → `StoreCart`
api: POST /wp-json/wc/store/v1/cart/remove-item → body `{key:string}` → `StoreCart`

client: `lib/store-api.ts` → fetchCart, addToCart, updateCartItem, removeCartItem
client: `hooks/use-cart.ts` → useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem
client: `components/AddToCartButton.tsx` → productId → mutate add
client: `components/CartView.tsx` → list items, qty +/- , remove, total
types: `StoreCart`, `StoreCartItem` ∈ `lib/types.ts`

env: NEXT_PUBLIC_WP_URL ! set (Store API base)
```

## §V

V1: ∀ add-item req → send `Cart-Token` when token ∃ in `localStorage`
V2: ∀ Store API res → persist new `Cart-Token` from response header when present
V3: add success → React Query cache `queryKeys.cart` = returned `StoreCart`
V4: cart page → render items from `useCart`; empty → message + link `/shop`
V5: cart item row → show name, unit price, qty controls, line total, remove
V6: `stock_status !== "instock"` → add button disabled (no silent fail)
V7: add/update/remove error → user-visible toast (Vietnamese)
V8: header → cart link `/cart` + live `items_count` badge when `items_count > 0`

## §T

| id  | status | task                                                                     | cites    |
| --- | ------ | ------------------------------------------------------------------------ | -------- |
| T1  | x      | wire `store-api.ts`: fetch/add/update/remove + token r/w                 | V1,V2,I  |
| T2  | ~      | hooks `use-cart.ts`: query + mutations, cache sync on success            | V3,V7,I  |
| T3  | .      | `AddToCartButton` on product detail + product cards (shop/category/home) | V6,V7,I  |
| T4  | .      | `/cart` page + `CartView`: list, qty +/-, remove, total, empty state     | V4,V5,I  |
| T5  | .      | header cart badge from `useCart` / `items_count`                         | V8,I     |
| T6  | .      | manual e2e: add from `/shop` → `/cart` shows item + correct total        | V1,V3,V4 |

## §B

| id  | date | cause | fix |
| --- | ---- | ----- | --- |
