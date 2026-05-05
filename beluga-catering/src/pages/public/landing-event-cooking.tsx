import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, Phone, ChefHat, Star, Clock, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import PricingTiers from "@/components/PricingTiers";
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const faqs = [
  { q: "Dịch vụ nấu ăn tại chỗ phù hợp với sự kiện nào?", a: "Phù hợp với hội nghị, gala dinner, tiệc khai trương, tất niên, đám cưới doanh nghiệp, và mọi sự kiện cần ẩm thực tươi sạch nấu trực tiếp tại địa điểm." },
  { q: "Đội ngũ đầu bếp có thể đến tận địa điểm không?", a: "Có, đội ngũ đầu bếp của BELUGA sẽ đến địa điểm của bạn đúng giờ, cùng thiết bị nấu ăn chuyên dụng và toàn bộ nguyên liệu tươi." },
  { q: "Cần chuẩn bị gì cho đội đầu bếp đến?", a: "Chúng tôi chỉ cần không gian bếp cơ bản hoặc không gian trống. BELUGA mang theo toàn bộ thiết bị, nguyên liệu và phụ kiện cần thiết." },
  { q: "Có thể nấu các món theo yêu cầu đặc biệt không?", a: "Hoàn toàn có thể. Đội đầu bếp của BELUGA thành thạo ẩm thực Việt, Á, Âu, Mediterranean và có thể thực hiện theo yêu cầu cụ thể của khách hàng." },
  { q: "Chi phí dịch vụ nấu ăn tại chỗ như thế nào?", a: "Chi phí tùy thuộc vào số khách, địa điểm và thực đơn. Liên hệ để nhận báo giá chi tiết — thường bắt đầu từ 200.000đ/người cho sự kiện từ 30 khách trở lên." },
];

const pricingTiers = [
  {
    name: "Teabreak",
    price: "Từ 120.000đ",
    desc: "/ người · Tối thiểu 20 khách",
    features: [
      "Bánh ngọt, bánh mặn đa dạng",
      "Thức uống (trà, cà phê, nước ép)",
      "Setup bàn teabreak đẹp",
      "Phục vụ tại chỗ 2 giờ",
      "Dọn dẹp sau sự kiện",
    ],
  },
  {
    name: "Sự Kiện",
    price: "Từ 250.000đ",
    desc: "/ người · Tối thiểu 30 khách",
    features: [
      "Buffet 12-15 món tươi nấu tại chỗ",
      "Khai vị + Tráng miệng",
      "Đầu bếp nấu trực tiếp tại địa điểm",
      "Phục vụ bàn chuyên nghiệp",
      "Setup & Dọn dẹp toàn bộ",
      "Thức uống đầy đủ",
    ],
    highlight: true,
    badge: "Được yêu thích",
  },
  {
    name: "Fine Dining",
    price: "Từ 500.000đ",
    desc: "/ người · Tối thiểu 20 khách",
    features: [
      "Set menu 6-8 món cao cấp",
      "Đầu bếp 5 sao phụ trách",
      "Rượu vang pairing (theo yêu cầu)",
      "Trang trí bàn ăn sang trọng",
      "Sommelier (theo yêu cầu)",
      "Event coordinator riêng",
    ],
  },
];

export default function LandingEventCooking() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <ServiceJsonLd
        name="Dịch Vụ Nấu Ăn Sự Kiện Chuyên Nghiệp — Hội Nghị, Gala"
        description="BELUGA Catering cung cấp dịch vụ nấu ăn tại chỗ chuyên nghiệp cho hội nghị, gala dinner, tiệc sự kiện tại TP.HCM."
        url="https://belugacatering.vn/dich-vu-nau-an-su-kien"
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Nấu ăn sự kiện", url: "https://belugacatering.vn/dich-vu-nau-an-su-kien" },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=90" alt="Nấu ăn tại sự kiện" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
            <span>/</span><span className="text-white">Nấu ăn sự kiện</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">Nấu ăn tại chỗ</span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">Dịch Vụ Nấu Ăn Sự Kiện Chuyên Nghiệp — Hội Nghị, Gala</h1>
            <p className="text-white/80 text-lg mb-8">Đội ngũ đầu bếp chuyên nghiệp đến tận địa điểm của bạn — nấu tươi, phục vụ trực tiếp. Trải nghiệm ẩm thực đỉnh cao cho sự kiện đặc biệt.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">Đặt dịch vụ ngay</a>
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
              <h2 className="text-3xl font-black text-foreground mb-4">Đầu Bếp Đến Tận Nơi — Nấu Tươi Tại Sự Kiện</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dịch vụ nấu ăn tại sự kiện của BELUGA mang trải nghiệm nhà hàng cao cấp đến tận địa điểm tổ chức sự kiện của bạn. Đội đầu bếp mang theo toàn bộ thiết bị và nguyên liệu tươi, nấu trực tiếp cho khách mời.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Từ teabreak hội nghị đơn giản đến gala dinner fine dining 7 món — BELUGA có đội ngũ và quy trình phù hợp cho mọi quy mô sự kiện.
              </p>
              <ul className="space-y-3">
                {[
                  "Đầu bếp chuyên nghiệp, được đào tạo chính quy",
                  "Nguyên liệu tươi, lấy hàng ngày từ chợ đầu mối",
                  "Thiết bị bếp chuyên dụng mang theo",
                  "Phục vụ bàn trực tiếp theo tiêu chuẩn khách sạn 5 sao",
                  "Setup và dọn dẹp toàn bộ sau sự kiện",
                  "Tư vấn thực đơn và concept ẩm thực miễn phí",
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
                { icon: ChefHat, value: "20+", label: "Đầu bếp chuyên nghiệp" },
                { icon: Award, value: "5 sao", label: "Tiêu chuẩn phục vụ" },
                { icon: Star, value: "4.9/5", label: "Đánh giá sự kiện" },
                { icon: Clock, value: "200+", label: "Sự kiện mỗi năm" },
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
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Quy Trình Nấu Ăn Tại Sự Kiện</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Tư vấn & thiết kế", d: "Chọn thực đơn, concept và số lượng khách" },
              { n: "02", t: "Chuẩn bị nguyên liệu", d: "Nguyên liệu tươi lấy trong ngày, sơ chế tại bếp trung tâm" },
              { n: "03", t: "Đến địa điểm setup", d: "Đội đầu bếp đến trước 2-3 giờ để setup và chuẩn bị" },
              { n: "04", t: "Phục vụ & dọn dẹp", d: "Nấu tươi, phục vụ trực tiếp và dọn dẹp sau sự kiện" },
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
            <h2 className="text-3xl font-black text-foreground">Đặt Dịch Vụ Nấu Ăn Sự Kiện</h2>
            <p className="text-muted-foreground mt-2">Tư vấn miễn phí — Báo giá trong 2 giờ</p>
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
              { label: "Tiệc công ty", href: "/dat-tiec-cong-ty" },
              { label: "Cơm văn phòng", href: "/com-van-phong" },
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
