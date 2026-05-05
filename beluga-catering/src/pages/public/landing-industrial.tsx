import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, Phone, Truck, Shield, Users, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import PricingTiers from "@/components/PricingTiers";
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const faqs = [
  { q: "Suất ăn công nghiệp tối thiểu bao nhiêu suất?", a: "Tối thiểu 50 suất/đơn cho gói cơ bản. Nhà máy từ 200+ công nhân được ưu đãi giá đặc biệt theo hợp đồng." },
  { q: "BELUGA đảm bảo vệ sinh thực phẩm như thế nào?", a: "Bếp sản xuất đạt chuẩn VSATTP, kiểm định định kỳ. Xe vận chuyển chuyên dụng cách nhiệt, đảm bảo nhiệt độ thực phẩm an toàn." },
  { q: "Thời gian giao hàng cho các ca làm việc như thế nào?", a: "Giao ca sáng: 11:00-12:30. Ca chiều: 17:00-18:00. Có thể phục vụ ca đêm theo yêu cầu đặc biệt." },
  { q: "Có thể ký hợp đồng dài hạn không?", a: "BELUGA ưu tiên hợp đồng 3 tháng, 6 tháng và 1 năm với giá ưu đãi 5-15%. Linh hoạt điều chỉnh số lượng hàng tháng." },
  { q: "Thực đơn có đa dạng không hay cố định?", a: "Thực đơn xoay vòng 14 ngày — không lặp lại trong 2 tuần. Cập nhật theo mùa và yêu cầu của doanh nghiệp." },
];

const pricingTiers = [
  {
    name: "Cơ Bản",
    price: "Từ 75.000đ",
    desc: "/ suất · Tối thiểu 50 suất",
    features: [
      "Cơm + 2 món mặn + canh",
      "Đóng gói vệ sinh",
      "Giao đúng giờ theo ca",
      "Xe chuyên dụng",
      "Menu xoay vòng 14 ngày",
    ],
  },
  {
    name: "Tiêu Chuẩn",
    price: "Từ 100.000đ",
    desc: "/ suất · Tối thiểu 100 suất",
    features: [
      "Cơm + 3 món mặn + 2 canh",
      "Tráng miệng (trái cây/bánh)",
      "Nước uống / trà",
      "Đóng gói cao cấp",
      "Báo cáo dinh dưỡng hàng tháng",
      "Account manager riêng",
    ],
    highlight: true,
    badge: "Phổ biến nhất",
  },
  {
    name: "Cao Cấp",
    price: "Từ 130.000đ",
    desc: "/ suất · Tối thiểu 200 suất",
    features: [
      "Buffet tại nhà máy",
      "Thực đơn tùy chỉnh hoàn toàn",
      "Đầu bếp phục vụ tại bếp nhà máy",
      "Quản lý căn-tin theo tháng",
      "Eat clean / dinh dưỡng chuyên sâu",
      "Báo cáo tổng hợp theo quý",
    ],
  },
];

export default function LandingIndustrial() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <ServiceJsonLd
        name="Suất Ăn Công Nghiệp Số Lượng Lớn — Giao Tận Nhà Máy, KCN"
        description="BELUGA Catering cung cấp suất ăn công nghiệp từ 50 đến 10.000+ suất/ngày. Phục vụ các KCN tại TP.HCM, Bình Dương, Đồng Nai."
        url="https://belugacatering.vn/suat-an-cong-nghiep"
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Suất ăn công nghiệp", url: "https://belugacatering.vn/suat-an-cong-nghiep" },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90" alt="Suất ăn công nghiệp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
            <span>/</span><span className="text-white">Suất ăn công nghiệp</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">Suất ăn công nghiệp TPHCM</span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">Suất Ăn Công Nghiệp Số Lượng Lớn — Giao Tận Nhà Máy, KCN</h1>
            <p className="text-white/80 text-lg mb-8">Giải pháp bữa ăn cho khu công nghiệp, nhà máy từ 50 đến 10.000+ công nhân. Đảm bảo VSATTP, đúng giờ, chất lượng ổn định.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">Nhận báo giá ngay</a>
              <a href="tel:0909123456" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" />0909 123 456
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
              <h2 className="text-3xl font-black text-foreground mb-4">Giải Pháp Bữa Ăn Toàn Diện Cho Nhà Máy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BELUGA Catering là đối tác suất ăn công nghiệp tin cậy của hơn 50 nhà máy và khu công nghiệp tại TP.HCM, Bình Dương và Đồng Nai. Chúng tôi có kinh nghiệm phục vụ từ 50 đến 10.000+ suất ăn mỗi ngày.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Hệ thống logistics chuyên nghiệp với xe tải cách nhiệt đảm bảo thực phẩm đến tay công nhân luôn tươi ngon, an toàn và đúng nhiệt độ theo quy định VSATTP.
              </p>
              <ul className="space-y-3">
                {[
                  "Phục vụ 50 đến 10.000+ suất/ngày",
                  "Xe tải cách nhiệt chuyên dụng",
                  "Bếp đạt chuẩn VSATTP, kiểm định hàng quý",
                  "Thực đơn xoay vòng 14 ngày",
                  "Giao đúng ca — cam kết hợp đồng",
                  "Giảm 5-15% khi ký hợp đồng dài hạn",
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-primary" /></div>
                    <span className="text-foreground text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, value: "10.000+", label: "Suất/ngày tối đa" },
                { icon: Clock, value: "100%", label: "Giao đúng giờ" },
                { icon: Users, value: "50+", label: "Nhà máy đang phục vụ" },
                { icon: Shield, value: "VSATTP", label: "Chứng nhận an toàn" },
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

      {/* Pricing */}
      <PricingTiers tiers={pricingTiers} />

      {/* Process */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Quy Trình Hợp Tác</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Khảo sát nhà máy", d: "Đội ngũ đến tham quan bếp, số công nhân và lịch ca" },
              { n: "02", t: "Thiết kế thực đơn", d: "Menu phù hợp dinh dưỡng, ngân sách và khẩu vị địa phương" },
              { n: "03", t: "Ký hợp đồng", d: "Hợp đồng rõ ràng, cam kết chất lượng và đúng giờ" },
              { n: "04", t: "Vận hành hàng ngày", d: "Giao hàng đúng ca, báo cáo chất lượng định kỳ" },
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

      {/* FAQs */}
      <section className="py-14 bg-muted/20">
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
      <section id="booking-form" className="py-14 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-foreground">Đặt Suất Ăn Công Nghiệp</h2>
            <p className="text-muted-foreground mt-2">Báo giá trong 2 giờ — Khảo sát nhà máy miễn phí</p>
          </div>
          <div className="bg-card rounded-3xl border-2 border-secondary/30 p-8 shadow-xl">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-bold text-muted-foreground mb-4">Dịch vụ liên quan</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Cơm văn phòng", href: "/com-van-phong" },
              { label: "Tiệc công ty", href: "/dat-tiec-cong-ty" },
              { label: "Cơm VP Bình Dương", href: "/com-van-phong-binh-duong" },
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
