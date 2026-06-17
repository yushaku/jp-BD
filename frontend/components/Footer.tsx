import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 bg-jp-indigo px-6 py-10 text-jp-border">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <h4 className="mb-2 text-jp-cream">JP Bùi Đặng</h4>
          <p className="text-sm text-jp-paper">
            Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-jp-cream">Liên hệ</h4>
          <p className="text-sm text-jp-paper">
            Hotline: 0901 234 567
            <br />
            Email: support@example.com
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-jp-cream">Chính sách</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/lien-he"
                className="text-jp-paper hover:text-jp-cream"
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="text-jp-paper hover:text-jp-cream"
              >
                Tài khoản
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-jp-sakura">
        © {new Date().getFullYear()} JP Bùi Đặng. Chính hãng · Nhập khẩu Nhật
        Bản.
      </p>
    </footer>
  );
}
