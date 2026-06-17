export function TrustBadges() {
  const items = [
    {
      title: "Nhập khẩu Nhật Bản",
      desc: "Nguồn gốc rõ ràng, tem phủ đầy đủ",
    },
    {
      title: "100% chính hãng",
      desc: "Cam kết hàng authentic",
    },
    {
      title: "Tư vấn tận tâm",
      desc: "Hỗ trợ chọn sản phẩm phù hợp",
    },
    {
      title: "Giao nhanh toàn quốc",
      desc: "HCM/HN 2–3 ngày",
    },
  ];

  return (
    <section className="mt-12 grid gap-6 border-t border-jp-border bg-jp-cream px-6 py-10 text-center sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title}>
          <strong className="mb-1 block text-[1.05rem] text-jp-ink">
            {item.title}
          </strong>
          <span className="text-sm text-jp-muted">{item.desc}</span>
        </div>
      ))}
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="mx-auto mt-8 max-w-6xl border-l-[3px] border-jp-indigo bg-white px-5 py-4 text-[0.8rem] leading-relaxed text-jp-muted">
      Thực phẩm chức năng không phải là thuốc, không có tác dụng thay thế thuốc
      chữa bệnh. Đọc kỹ hướng dẫn trước khi sử dụng.
    </p>
  );
}
