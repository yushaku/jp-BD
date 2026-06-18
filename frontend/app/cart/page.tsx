import { CartBreadcrumb, CartView } from "./components";

export const metadata = {
  title: "Giỏ hàng",
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6 sm:py-10">
      <CartBreadcrumb />

      <header className="mb-8 border-b-2 border-jp-border pb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
          Đơn hàng
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold text-jp-ink">
          Giỏ hàng
        </h1>
        <p className="mt-2 text-[0.95rem] text-jp-muted">
          Xem và chỉnh sửa đơn hàng của bạn
        </p>
      </header>

      <CartView />
    </section>
  );
}
