import type { Metadata } from "next";
import { ContactInfoGrid, ContactForm } from "./components/";
import { contactInfo } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ JP Bùi Đặng — tư vấn thực phẩm, mỹ phẩm & TPCN Nhật Bản. Hotline, email, địa chỉ và form gửi tin nhắn.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
          Giữ liên lạc với chúng tôi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {contactInfo.intro}
        </p>
      </section>

      <ContactInfoGrid />
      <ContactForm />
    </section>
  );
}
