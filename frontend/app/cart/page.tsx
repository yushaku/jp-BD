import { CartView } from "@/components/CartView";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Giỏ hàng",
};

export default function CartPage() {
  return (
    <Section title="Giỏ hàng" description="Xem và chỉnh sửa đơn hàng của bạn">
      <CartView />
    </Section>
  );
}
