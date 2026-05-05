import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, MapPin, Clock, Shield, Star, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import MenuCard from "@/components/MenuCard";
import { useListMenus } from "@workspace/api-client-react";

const districts = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 7", "Quận 10",
  "Bình Thạnh", "Phú Nhuận", "Gò Vấp", "Tân Bình", "Tân Phú", "Bình Tân",
  "Thủ Đức", "Nhà Bè", "Bình Chánh",
];

const benefits = [
  "Phủ sóng toàn bộ 24 quận/huyện TP.HCM",
  "Giao hàng trong vòng 2 giờ — cam kết đúng giờ",
  "Đội ngũ 50+ nhân sự, phương tiện chuyên dụng",
  "Đầu bếp có chứng chỉ VSATTP, kiểm định hàng quý",
  "Thực đơn đa dạng: Việt, Á, Âu — phù hợp mọi sự kiện",
  "Hỗ trợ 24/7 — hotline 0909 123 456",
];

const faqs = [
  { q: "BELUGA phục vụ những quận nào ở TP.HCM?", a: "BELUGA phục vụ toàn bộ 24 quận huyện TP.HCM bao gồm các trung tâm như Q1, Q3, Q7, Bình Thạnh, và các khu vực ngoại thành như Bình Chánh, Nhà Bè, Củ Chi." },
  { q: "Thời gian giao hàng tối thiểu là bao lâu?", a: "Đơn lẻ cần đặt trước 1 ngày. Đơn định kỳ (hàng ngày/tuần) sẽ có slot cố định và được ưu tiên." },
  { q: "Có phụ phí giao hàng xa không?", a: "Với các quận trung tâm, phí giao hàng đã bao gồm trong giá. Khu vực ngoại thành có thể phát sinh phụ phí nhỏ — liên hệ để được báo giá chính xác." },
  { q: "Đặt tối thiểu bao nhiêu suất?", a: "Tối thiểu 10 suất cho cơm văn phòng. Tiệc sự kiện tối thiểu 20 khách." },
];

export default function LandingTPHCM() {
  const { data: menus } = useListMenus({ featured: true } as Parameters<typeof useListMenus>[0]);
  const featuredMenus = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=90" alt="Catering TPHCM" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5" /> Phủ sóng toàn TP.HCM
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              Dịch Vụ Catering<br />
              <span className="text-secondary">TP. Hồ Chí Minh</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Phủ sóng 24 quận huyện — BELUGA mang ẩm thực cao cấp đến tận địa điểm tổ chức sự kiện của bạn tại TPHCM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">
                Nhận báo giá ngay
              </a>
              <a href="tel:0909123456" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> 0909 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-white/70 text-sm font-semibold uppercase tracking-wider mb-5">Phủ sóng tất cả quận huyện</p>
          <div className="flex flex-wrap justify-center gap-3">
            {districts.map((d, i) => (
              <motion.span
                key={d}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full"
              >
                {d}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary text-sm font-bold uppercase tracking-wider">Tại sao chọn BELUGA TPHCM</span>
              <h2 className="text-3xl font-black text-foreground mt-2 mb-6">Đối Tác Catering Tin Cậy Nhất TP.HCM</h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, value: "24", label: "Quận/huyện phủ sóng" },
                { icon: Clock, value: "100%", label: "Đúng giờ cam kết" },
                { icon: Star, value: "500+", label: "Sự kiện thành công" },
                { icon: Shield, value: "8+", label: "Năm kinh nghiệm" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-5 text-center">
                  <s.icon className="w-7 h-7 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menus */}
      {featuredMenus.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-foreground">Menu Phổ Biến Tại TP.HCM</h2>
              <p className="text-muted-foreground mt-2">Phù hợp với mọi loại sự kiện doanh nghiệp</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredMenus.map((menu, i) => <MenuCard key={menu.id} menu={menu} index={i} />)}
            </div>
            <div className="text-center">
              <Link href="/menus"><span className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Xem tất cả thực đơn</span></Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Câu Hỏi Thường Gặp</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <p className="font-bold text-foreground mb-2">{faq.q}</p>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking-form" className="py-16 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-foreground">Đặt Catering Tại TP.HCM</h2>
            <p className="text-muted-foreground mt-2">Phản hồi trong 2 giờ — Phục vụ tất cả 24 quận huyện</p>
          </div>
          <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
