export const contactInfo = {
  brand: "JP Bùi Đặng",
  intro:
    "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn về thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản - tư vấn sản phẩm, đơn hàng và chính sách giao hàng.",
  address: {
    title: "Địa chỉ",
    lines: [
      "123 Nguyễn Huệ",
      "Phường Bến Nghé, Quận 1",
      "TP. Hồ Chí Minh, Việt Nam",
    ],
  },
  contact: {
    title: "Liên hệ",
    hotline: "0901 234 567",
    hotlineHref: "tel:+84901234567",
    email: "support@example.com",
    emailHref: "mailto:support@example.com",
    zaloHref: "https://zalo.me/84901234567",
    messengerHref: "https://m.me/jpbuidang",
  },
  hours: {
    title: "Giờ hoạt động",
    weekdays: { label: "Thứ 2 – Thứ 6", time: "08:30 – 20:00" },
    weekend: { label: "Thứ 7 & Chủ nhật", time: "09:30 – 21:30" },
  },
  shipping: {
    hcm: "Nội thành HCM/HN: 2–3 ngày làm việc",
    nationwide: "Tỉnh thành khác: 3–7 ngày làm việc",
    freeFrom: "500.000đ",
  },
} as const;

export const supportLinks = [
  { href: "/lien-he#van-chuyen", label: "Phương thức vận chuyển" },
  { href: "/lien-he#thanh-toan", label: "Phương thức thanh toán" },
  { href: "/account", label: "Hướng dẫn mua hàng" },
  { href: "/shop", label: "Sản phẩm" },
] as const;

export const policyLinks = [
  { href: "/account", label: "Chính sách đổi trả" },
  { href: "/account", label: "Chính sách bảo mật" },
  { href: "/account", label: "Cam kết chất lượng" },
] as const;
