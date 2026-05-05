import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, Star, Phone, Users, Trophy, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import MenuCard from "@/components/MenuCard";
import PricingTiers from "@/components/PricingTiers";
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { useListMenus } from "@workspace/api-client-react";

const faqs = [
  { q: "BELUGA phục vụ tiệc công ty tối đa bao nhiêu người?", a: "BELUGA tổ chức tiệc từ 20 đến 1000+ khách. Chúng tôi có kinh nghiệm với gala dinner, tất niên, hội nghị và khai trương." },
  { q: "Cần đặt trước bao lâu cho tiệc công ty?", a: "Khuyến nghị đặt trước ít nhất 7-14 ngày. Tiệc lớn 200+ người nên đặt trước 1 tháng để đảm bảo chất lượng." },
  { q: "BELUGA có phục vụ rượu và thức uống không?", a: "Có, BELUGA cung cấp thức uống đầy đủ theo yêu cầu. Rượu vang, champagne và đồ uống không cồn đều có sẵn." },
  { q: "Có thể tùy chỉnh menu theo chủ đề tiệc không?", a: "Hoàn toàn có thể. BELUGA thiết kế menu theo chủ đề — Việt Nam, Á Đông, Mediterranean, Fusion — phù hợp mọi concept." },
  { q: "Chi phí setup và dịch vụ tại chỗ như thế nào?", a: "Gói tiệc bao gồm setup, phục vụ tại chỗ và dọn dẹp sau tiệc. Liên hệ để nhận báo giá chi tiết theo quy mô sự kiện." },
];

const pricingTiers = [
  {
    name: "Hội Nghị",
    price: "Từ 180.000đ",
    desc: "/ người · Tối thiểu 20 khách",
    features: [
      "Buffet hoặc set menu",
      "Teabreak giữa giờ",
      "Setup bàn ghế cơ bản",
      "Phục vụ tại chỗ",
      "Thức uống nước lọc + nước ngọt",
    ],
  },
  {
    name: "Tiệc Công Ty",
    price: "Từ 350.000đ",
    desc: "/ người · Tối thiểu 50 khách",
    features: [
      "Buffet cao cấp 15-20 món",
      "Khai vị + Tráng miệng",
      "Thức uống đầy đủ",
      "Setup trang trí theo chủ đề",
      "Đội phục vụ chuyên nghiệp",
      "MC support (theo yêu cầu)",
    ],
    highlight: true,
    badge: "Được đặt nhiều nhất",
  },
  {
    name: "Gala Dinner",
    price: "Từ 650.000đ",
    desc: "/ người · Tối thiểu 100 khách",
    features: [
      "Set menu 5-7 món fine dining",
      "Rượu vang / champagne khai tiệc",
      "Trang trí sân khấu cao cấp",
      "Đội ngũ phục vụ riêng từng bàn",
      "Flower arrangement",
      "Event coordinator riêng",
    ],
  },
];

const testimonials = [
  { name: "Hoàng Thanh Bình", role: "COO — FPT Software HCM", text: "Tiệc tất niên 500 người của FPT tổ chức qua BELUGA thành công ngoài mong đợi. Chuyên nghiệp từng chi tiết nhỏ.", rating: 5 },
  { name: "Nguyễn Thị Lan", role: "Marketing Director — Vingroup", text: "Gala kỷ niệm 10 năm công ty — BELUGA thực hiện xuất sắc. Thực đơn fine dining 7 món, phục vụ tận tình.", rating: 5 },
  { name: "Trần Đức Thắng", role: "CEO — Saigon Tech", text: "Tiệc khai trương văn phòng mới rất ấn tượng. Khách mời khen ngợi cả thức ăn lẫn cách trình bày.", rating: 5 },
];

export default function LandingCorporate() {
  const { data: menus } = useListMenus({ category: "event" } as Parameters<typeof useListMenus>[0]);
  const eventMenus = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <ServiceJsonLd
        name="Đặt Tiệc Công Ty Trọn Gói Tại TPHCM — Từ 50 Đến 1000 Khách"
        description="BELUGA Catering tổ chức tiệc công ty chuyên nghiệp tại TP.HCM. Gala dinner, tất niên, hội nghị từ 50 đến 1000+ khách."
        url="https://belugacatering.vn/dat-tiec-cong-ty"
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Đặt tiệc công ty", url: "https://belugacatering.vn/dat-tiec-cong-ty" },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=90" alt="Tiệc công ty TPHCM" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
            <span>/</span><span className="text-white">Đặt tiệc công ty</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">Tiệc doanh nghiệp TPHCM</span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">Đặt Tiệc Công Ty Trọn Gói Tại TPHCM — Từ 50 Đến 1000 Khách</h1>
            <p className="text-white/80 text-xl mb-8 leading-relaxed">Từ hội nghị 20 người đến gala dinner 500 khách — BELUGA tổ chức hoàn hảo từng chi tiết, đúng ngân sách.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">Nhận báo giá miễn phí</a>
              <a href="tel:0909123456" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> 0909 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-foreground">Tiệc Doanh Nghiệp Đẳng Cấp</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4 text-center max-w-3xl mx-auto">
            BELUGA Catering chuyên tổ chức tiệc doanh nghiệp cao cấp tại TP.HCM — từ tiệc tất niên, lễ kỷ niệm, khai trương đến hội nghị và gala dinner. Đội ngũ event coordinator giàu kinh nghiệm sẽ đồng hành cùng bạn từ khâu lên kế hoạch đến khi tiệc kết thúc.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Users, value: "1000+", label: "Khách tối đa" },
              { icon: Trophy, value: "300+", label: "Tiệc công ty đã tổ chức" },
              { icon: Star, value: "4.9/5", label: "Đánh giá từ doanh nghiệp" },
              { icon: Sparkles, value: "8 năm", label: "Kinh nghiệm tổ chức sự kiện" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 text-center">
                <s.icon className="w-7 h-7 text-primary mx-auto mb-2" />
                <p className="text-xl font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingTiers tiers={pricingTiers} />

      {/* Process */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Quy Trình Tổ Chức Tiệc</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Tư vấn nhu cầu", d: "Thảo luận quy mô, chủ đề, ngân sách và ngày tổ chức" },
              { n: "02", t: "Thiết kế menu & concept", d: "Lên menu tùy chỉnh và concept trang trí theo yêu cầu" },
              { n: "03", t: "Ký hợp đồng & deposit", d: "Xác nhận hợp đồng, đặt cọc 30% để giữ ngày" },
              { n: "04", t: "Phục vụ hoàn hảo", d: "Đội ngũ chuyên nghiệp phục vụ từng phút của sự kiện" },
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-black shadow-lg shadow-primary/20">{s.n}</div>
                <h3 className="font-bold text-foreground mb-1">{s.t}</h3>
                <p className="text-muted-foreground text-sm">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-foreground text-center mb-8">Hình Ảnh Tiệc Thực Tế</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                <img src={src} alt={`Tiệc công ty ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event menus */}
      {eventMenus.length > 0 && (
        <section className="py-14 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-black text-foreground text-center mb-8">Thực Đơn Tiệc Sự Kiện</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {eventMenus.map((menu, i) => <MenuCard key={menu.id} menu={menu} index={i} />)}
            </div>
            <div className="text-center">
              <Link href="/menus"><span className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Xem thêm thực đơn</span></Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-14 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-8">Doanh Nghiệp Tin Tưởng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/10 rounded-2xl p-5 border border-white/20">
                <div className="flex gap-0.5 mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}</div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-bold text-white text-sm">{t.name}</p>
                <p className="text-white/60 text-xs">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-foreground text-center mb-8">Câu Hỏi Thường Gặp</h2>
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
      <section id="booking-form" className="py-14 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-foreground">Đặt Tiệc Công Ty Ngay</h2>
            <p className="text-muted-foreground mt-2">Báo giá trong 2 giờ — Không cần đặt cọc khi tư vấn</p>
          </div>
          <div className="bg-card rounded-3xl border-2 border-secondary/30 p-8 shadow-xl">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-bold text-muted-foreground mb-4">Dịch vụ liên quan</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Cơm văn phòng", href: "/com-van-phong" },
              { label: "Nấu ăn sự kiện", href: "/dich-vu-nau-an-su-kien" },
              { label: "Suất ăn công nghiệp", href: "/suat-an-cong-nghiep" },
              { label: "Xem thực đơn", href: "/menus" },
              { label: "Blog catering", href: "/blog" },
            ].map((l) => (
              <Link key={l.href} href={l.href}><span className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer">{l.label}</span></Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
