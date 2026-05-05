import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="text-3xl font-black tracking-wider text-primary mb-4">BELUGA</div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs mb-6">
              Dịch vụ catering cao cấp tại TP.HCM — mang nghệ thuật ẩm thực đẳng cấp đến mọi sự kiện của bạn. Hơn 500 sự kiện thành công.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com/belugacatering" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-background/50 mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              {[
                { label: "Cơm văn phòng", href: "/com-van-phong" },
                { label: "Tiệc công ty", href: "/dat-tiec-cong-ty" },
                { label: "Suất ăn công nghiệp", href: "/suat-an-cong-nghiep" },
                { label: "Nấu ăn sự kiện", href: "/dich-vu-nau-an-su-kien" },
                { label: "Thực đơn", href: "/menus" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm text-background/70 hover:text-background transition-colors cursor-pointer">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-background/50 mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="tel:0909123456" className="text-sm text-background/70 hover:text-background transition-colors">0909 123 456</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="mailto:hello@belugacatering.vn" className="text-sm text-background/70 hover:text-background transition-colors">hello@belugacatering.vn</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-background/70">TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">© 2025 BELUGA Catering. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/blog"><span className="text-sm text-background/50 hover:text-background transition-colors cursor-pointer">Blog</span></Link>
            <Link href="/contact"><span className="text-sm text-background/50 hover:text-background transition-colors cursor-pointer">Liên hệ</span></Link>
            <Link href="/admin"><span className="text-sm text-background/50 hover:text-background transition-colors cursor-pointer">Admin</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
