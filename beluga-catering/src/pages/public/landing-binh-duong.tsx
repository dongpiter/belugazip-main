import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, MapPin, Clock, Truck, Star, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import MenuCard from "@/components/MenuCard";
import { useListMenus } from "@workspace/api-client-react";

const areas = [
  "Thủ Dầu Một", "Dĩ An", "Thuận An", "Bình Dương", "Tân Uyên", "Bến Cát",
  "Phú Giáo", "Bàu Bàng", "KCN VSIP 1", "KCN VSIP 2", "KCN Bình Dương",
];

const benefits = [
  "Phục vụ các khu công nghiệp lớn tại Bình Dương",
  "Suất ăn công nghiệp từ 500 đến 5000 suất/ngày",
  "Xe tải chuyên dụng, đảm bảo nhiệt độ vận chuyển",
  "Giấy phép VSATTP, kiểm tra định kỳ theo quy định",
  "Thực đơn xoay vòng — không bao giờ bị lặp lại trong 14 ngày",
  "Hỗ trợ ký hợp đồng dài hạn — giảm giá 5-15%",
];

const faqs = [
  { q: "BELUGA có phục vụ khu công nghiệp Bình Dương không?", a: "Có, BELUGA phục vụ tất cả các KCN tại Bình Dương bao gồm VSIP 1, VSIP 2, KCN Bình Dương, KCN Sóng Thần và các khu vực lân cận." },
  { q: "Suất ăn công nghiệp tại Bình Dương có giá bao nhiêu?", a: "Giá từ 75.000đ/suất cho gói cơ bản đến 130.000đ/suất cho gói cao cấp. Giá tốt hơn khi ký hợp đồng dài hạn." },
  { q: "BELUGA có thể cung cấp bao nhiêu suất/ngày cho nhà máy?", a: "BELUGA có thể cung cấp từ 200 đến 5000+ suất/ngày cho các nhà máy và xí nghiệp tại Bình Dương." },
  { q: "Thời gian giao hàng như thế nào?", a: "Giao đúng ca ăn: 11:30-12:00 (ca sáng), 17:30-18:00 (ca chiều). Cam kết đúng giờ theo hợp đồng." },
];

export default function LandingBinhDuong() {
  const { data: menus } = useListMenus({ category: "office" } as Parameters<typeof useListMenus>[0]);
  const officeMenus = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1488992783499-418eb1f62d08?w=1600&q=90" alt="Catering Bình Dương" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5" /> Cơm văn phòng Bình Dương
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              Cơm Văn Phòng &<br />
              <span className="text-secondary">Suất Ăn Bình Dương</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Giải pháp bữa ăn chuyên nghiệp cho doanh nghiệp và khu công nghiệp tại Bình Dương. Giao đúng giờ, đảm bảo vệ sinh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">
                Nhận báo giá miễn phí
              </a>
              <a href="tel:0909123456" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> 0909 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-10 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-white/70 text-sm font-semibold uppercase tracking-wider mb-5">Khu vực phục vụ tại Bình Dương</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((a, i) => (
              <motion.span
                key={a}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full"
              >
                {a}
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
              <span className="text-primary text-sm font-bold uppercase tracking-wider">Giải pháp toàn diện</span>
              <h2 className="text-3xl font-black text-foreground mt-2 mb-6">Cơm Văn Phòng & KCN Bình Dương</h2>
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
                { icon: Truck, value: "5000+", label: "Suất/ngày tối đa" },
                { icon: Clock, value: "100%", label: "Giao đúng giờ" },
                { icon: Star, value: "50+", label: "Nhà máy đang dùng" },
                { icon: MapPin, value: "8+", label: "Khu công nghiệp" },
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

      {/* Menus */}
      {officeMenus.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-foreground">Thực Đơn Cho Văn Phòng & KCN</h2>
              <p className="text-muted-foreground mt-2">Phù hợp với suất ăn hàng ngày tại Bình Dương</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {officeMenus.map((menu, i) => <MenuCard key={menu.id} menu={menu} index={i} />)}
            </div>
            <div className="text-center">
              <Link href="/menus"><span className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Xem thêm thực đơn</span></Link>
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
            <h2 className="text-3xl font-black text-foreground">Đặt Catering Tại Bình Dương</h2>
            <p className="text-muted-foreground mt-2">Báo giá ngay — Phục vụ toàn tỉnh Bình Dương</p>
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
