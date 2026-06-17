import { Globe, MessageCircle, ShieldCheck, Truck } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "Nhập khẩu Nhật Bản",
    desc: "Nguồn gốc rõ ràng, tem phủ đầy đủ",
  },
  {
    icon: ShieldCheck,
    title: "100% chính hãng",
    desc: "Cam kết hàng authentic",
  },
  {
    icon: MessageCircle,
    title: "Tư vấn tận tâm",
    desc: "Hỗ trợ chọn sản phẩm phù hợp",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    desc: "HCM/HN 2–3 ngày",
  },
] as const;

export function TrustBadges() {
  return (
    <section className="mx-auto mb-12 max-w-6xl px-6">
      <header className="mb-8 border-b-2 border-jp-matcha pb-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-jp-gold">
          Tại sao chọn chúng tôi
        </p>
        <h2 className="mt-1 text-[1.65rem] text-jp-ink">Cam kết chất lượng</h2>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li
              key={item.title}
              className="flex flex-col items-center rounded-(--jp-radius) border border-jp-border bg-jp-cream px-3 py-5 text-center shadow-(--jp-shadow) sm:px-4 sm:py-6"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-jp-paper ring-1 ring-jp-border sm:mb-4 sm:size-11">
                <Icon className="size-5 text-jp-matcha" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold leading-snug text-jp-ink sm:text-[1.05rem]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-jp-muted sm:text-sm">
                {item.desc}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
