import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, Clock, Shield, Star, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import MenuCard from "@/components/MenuCard";
import PricingTiers from "@/components/PricingTiers";
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { useListMenus } from "@workspace/api-client-react";

const benefits = [
  "Giao hàng đúng giờ 100% — cam kết hợp đồng",
  "Thực đơn thay đổi hàng tuần — không lặp lại",
  "Đầu bếp chuyên nghiệp, kiểm định VSATTP",
  "Đóng gói vệ sinh, bao bì cao cấp có thương hiệu",
  "Tùy chỉnh theo khẩu vị và dị ứng thực phẩm",
  "Tối thiểu chỉ 10 suất — phù hợp mọi quy mô",
];

const faqs = [
  { q: "Đặt cơm văn phòng tối thiểu bao nhiêu suất?", a: "Tối thiểu 10 suất/đơn. BELUGA phục vụ công ty từ 10 đến 1000+ nhân viên." },
  { q: "Thực đơn có thay đổi không?", a: "Có, thực đơn được thay đổi hàng tuần để đảm bảo sự đa dạng và không nhàm chán. Chu kỳ xoay vòng 14 ngày." },
  { q: "Bao lâu trước cần đặt?", a: "Nên đặt trước 1 ngày. Với đơn hàng định kỳ, chúng tôi ưu tiên slot giao hàng cố định cho bạn." },
  { q: "Có gói đặt theo tháng không?", a: "Có, gói tháng giảm 5-10% và được ưu tiên slot giao hàng. Gói quý và năm giảm thêm." },
  { q: "Có phục vụ khu vực ngoại thành không?", a: "BELUGA phủ sóng 24 quận huyện TP.HCM và các tỉnh lân cận như Bình Dương, Đồng Nai. Có thể phát sinh phụ phí khu vực xa." },
];

const pricingTiers = [
  {
    name: "Cơ Bản",
    price: "Từ 85.000đ",
    desc: "/ suất · Tối thiểu 10 suất",
    features: [
      "Cơm + 2 món mặn + canh",
      "Tráng miệng (trái cây)",
      "Đóng gói hộp xốp cao cấp",
      "Giao đúng giờ",
      "Menu xoay vòng 14 ngày",
    ],
  },
  {
    name: "Tiêu Chuẩn",
    price: "Từ 120.000đ",
    desc: "/ suất · Tối thiểu 20 suất",
    features: [
      "Cơm + 3 món mặn + 2 canh",
      "Tráng miệng + nước uống",
      "Hộp giấy kraft có thương hiệu",
      "Giao đúng giờ ưu tiên",
      "Tùy chỉnh theo yêu cầu",
      "Hotline hỗ trợ riêng",
    ],
    highlight: true,
    badge: "Phổ biến nhất",
  },
  {
    name: "Cao Cấp",
    price: "Từ 180.000đ",
    desc: "/ suất · Tối thiểu 30 suất",
    features: [
      "Cơm + 4 món cao cấp + 2 canh",
      "Súp khai vị + tráng miệng",
      "Đầu bếp phụ trách riêng",
      "Bao bì premium + thương hiệu",
      "Thực đơn tùy chỉnh hoàn toàn",
      "Account manager cá nhân",
    ],
  },
];

const testimonials = [
  { name: "Nguyễn Minh Tú", role: "HR Director — Techz Vietnam", text: "BELUGA phục vụ 120 suất/ngày cho văn phòng chúng tôi 18 tháng liên tục. Không một lần trễ hẹn.", rating: 5 },
  { name: "Phạm Thu Hương", role: "Office Manager — ANZ Bank HCM", text: "Thực đơn phong phú, đổi món hàng tuần nên nhân viên không bao giờ chán. Rất đáng giá tiền.", rating: 5 },
  { name: "Trần Đức Hải", role: "CEO — Startup Hub TPHCM", text: "Gói tháng tiết kiệm được 10% so với đặt từng ngày. Dịch vụ chuyên nghiệp từ A đến Z.", rating: 5 },
];

export default function LandingOffice() {
  const { data: menus } = useListMenus({ category: "office" } as Parameters<typeof useListMenus>[0]);
  const officeMenus = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <ServiceJsonLd
        name="Dịch Vụ Cơm Văn Phòng TPHCM — Suất Ăn Trưa Tận Nơi"
        description="BELUGA Catering cung cấp dịch vụ cơm văn phòng cao cấp tại TP.HCM. Giao tận nơi, đúng giờ, thực đơn đa dạng từ 85.000đ/suất."
        url="https://belugacatering.vn/com-van-phong"
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Cơm văn phòng TPHCM", url: "https://belugacatering.vn/com-van-phong" },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&q=90" alt="Cơm văn phòng cao cấp TPHCM" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
            <span>/</span>
            <span className="text-white">Cơm văn phòng</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              Dịch vụ cơm văn phòng TPHCM
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Dịch Vụ Cơm Văn Phòng TPHCM — Suất Ăn Trưa Tận Nơi
            </h1>
            <p className="text-white/80 text-xl mb-8 leading-relaxed">
              Suất ăn cao cấp giao tận văn phòng — đúng giờ, đủ chất, ngon miệng. Phục vụ hơn 150 doanh nghiệp tại TP.HCM.
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

      {/* Description */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary text-sm font-bold uppercase tracking-wider">Tại sao chọn BELUGA</span>
              <h2 className="text-3xl font-black text-foreground mt-2 mb-4">Đối Tác Catering Văn Phòng Số 1 TP.HCM</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BELUGA Catering đã cung cấp dịch vụ suất ăn văn phòng chuyên nghiệp tại TP.HCM hơn 8 năm. Chúng tôi phục vụ từ startup 10 người đến tập đoàn 1000+ nhân viên — mỗi bữa ăn đều được chuẩn bị bởi đội ngũ đầu bếp có chứng chỉ VSATTP.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Với thực đơn xoay vòng 14 ngày và tùy chỉnh theo khẩu vị địa phương, nhân viên của bạn sẽ luôn có bữa trưa ngon miệng, cân bằng dinh dưỡng — không bao giờ nhàm chán.
              </p>
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
                { icon: Clock, value: "100%", label: "Đúng giờ cam kết" },
                { icon: Shield, value: "VSATTP", label: "Chứng nhận vệ sinh" },
                { icon: Star, value: "4.9/5", label: "Đánh giá trung bình" },
                { icon: Check, value: "150+", label: "Doanh nghiệp đang dùng" },
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
        </div>
      </section>

      {/* Pricing Tiers */}
      <PricingTiers tiers={pricingTiers} />

      {/* Menus */}
      {officeMenus.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-foreground">Thực Đơn Cơm Văn Phòng</h2>
              <p className="text-muted-foreground mt-2">Đa dạng lựa chọn — phù hợp mọi ngân sách</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {officeMenus.map((menu, i) => <MenuCard key={menu.id} menu={menu} index={i} />)}
            </div>
            <div className="text-center">
              <Link href="/menus"><span className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Xem tất cả thực đơn</span></Link>
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="py-14 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Quy Trình 4 Bước Đơn Giản</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Liên hệ tư vấn", d: "Gọi điện hoặc điền form — phản hồi trong 2 giờ" },
              { n: "02", t: "Chọn thực đơn", d: "Tùy chỉnh theo yêu cầu và ngân sách của bạn" },
              { n: "03", t: "Ký hợp đồng", d: "Cam kết đúng giờ, chất lượng đảm bảo" },
              { n: "04", t: "Giao hàng hàng ngày", d: "Đúng giờ, đúng địa điểm, đúng số suất" },
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

      {/* Testimonials */}
      <section className="py-14 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-8">Khách Hàng Nói Gì</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/10 rounded-2xl p-5 border border-white/20">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-bold text-white text-sm">{t.name}</p>
                <p className="text-white/60 text-xs">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl font-black text-foreground">Đặt Cơm Văn Phòng Ngay</h2>
            <p className="text-muted-foreground mt-2">Báo giá trong 2 giờ — Không cần đặt cọc khi tư vấn</p>
          </div>
          <div className="bg-card rounded-3xl border-2 border-secondary/30 p-8 shadow-xl">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-10 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-bold text-muted-foreground mb-4">Dịch vụ liên quan</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Tiệc công ty", href: "/dat-tiec-cong-ty" },
              { label: "Suất ăn công nghiệp", href: "/suat-an-cong-nghiep" },
              { label: "Nấu ăn sự kiện", href: "/dich-vu-nau-an-su-kien" },
              { label: "Xem thực đơn", href: "/menus" },
              { label: "Blog catering", href: "/blog" },
            ].map((l) => (
              <Link key={l.href} href={l.href}>
                <span className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
