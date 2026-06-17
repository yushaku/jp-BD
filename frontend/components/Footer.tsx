import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 bg-jp-indigo px-6 py-10 text-[#e8e4e0]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <h4 className="mb-2 font-[family-name:var(--font-lora)] text-white">
            JP Bùi Đặng
          </h4>
          <p className="text-sm text-[#d4cfc7]">
            Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản.
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-[family-name:var(--font-lora)] text-white">
            Liên hệ
          </h4>
          <p className="text-sm text-[#d4cfc7]">
            Hotline: 0901 234 567
            <br />
            Email: support@example.com
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-[family-name:var(--font-lora)] text-white">
            Chính sách
          </h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/account" className="text-[#d4cfc7] hover:text-white">
                Tài khoản
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-[#d4cfc7]">
        © {new Date().getFullYear()} JP Bùi Đặng. Chính hãng · Nhập khẩu Nhật Bản.
      </p>
    </footer>
  );
}
