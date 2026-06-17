"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactInfo } from "@/lib/contact";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast.error("Vui lòng điền họ tên, email và nội dung tin nhắn.");
      setLoading(false);
      return;
    }

    // Placeholder: wire to Contact Form 7 / API later
    await new Promise((r) => setTimeout(r, 600));

    toast.success("Đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.");
    form.reset();
    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <Card className="border-0 bg-jp-cream ring-0 shadow-none">
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-xl">
            Gửi tin nhắn đến {contactInfo.brand}
          </CardTitle>
          <CardDescription>
            Điền form bên dưới — đội ngũ tư vấn sẽ liên hệ trong giờ làm việc
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-12">
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nguyễn Văn A"
                required
                autoComplete="name"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0901 234 567"
                  autoComplete="tel"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Nội dung *</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Bạn cần tư vấn sản phẩm, đơn hàng hoặc chính sách giao hàng..."
                rows={10}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full px-6 py-4 uppercase tracking-wider sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  Gửi
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
