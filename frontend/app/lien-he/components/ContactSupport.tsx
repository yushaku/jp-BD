import Link from "next/link";
import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactInfo, policyLinks, supportLinks } from "@/lib/contact";

export function ContactSupportSections() {
  const { shipping } = contactInfo;

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 pb-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 bg-white ring-0 shadow-none" id="ho-tro">
          <CardHeader>
            <CardTitle className="text-base">Hỗ trợ khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold text-jp-indigo">
              <a href={contactInfo.contact.hotlineHref}>
                {contactInfo.contact.hotline}
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              <a
                href={contactInfo.contact.emailHref}
                className="hover:text-foreground"
              >
                {contactInfo.contact.email}
              </a>
            </p>
            <ul className="space-y-2 border-t border-jp-border/40 pt-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-jp-indigo"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white ring-0 shadow-none" id="van-chuyen">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="size-4 text-jp-gold" />
              Phương thức vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Miễn phí vận chuyển toàn quốc cho đơn hàng từ{" "}
              <strong className="text-foreground">{shipping.freeFrom}</strong>.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>{shipping.hcm}</li>
              <li>{shipping.nationwide}</li>
            </ul>
            <p>
              Sau khi đặt hàng thành công, chúng tôi tiến hành đóng gói và giao
              qua đơn vị vận chuyển. Nhân viên giao hàng sẽ liên hệ nếu cần xác
              nhận địa chỉ.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white ring-0 shadow-none" id="thanh-toan">
          <CardHeader>
            <CardTitle className="text-base">Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-inside list-disc space-y-1">
              <li>Thanh toán khi nhận hàng (COD)</li>
              <li>Chuyển khoản ngân hàng</li>
              <li>Ví MoMo</li>
              <li>VNPay (sandbox)</li>
            </ul>
            <p className="border-t border-jp-border/40 pt-3 font-medium text-foreground">
              Về JP Bùi Đặng
            </p>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-jp-indigo">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
