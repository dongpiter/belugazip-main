import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Check, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const districtData: Record<string, { name: string; title: string; desc: string; faqs: { q: string; a: string }[] }> = {
  "com-van-phong-quan-1": {
    name: "Quận 1",
    title: "Dịch Vụ Cơm Văn Phòng Quận 1 TP.HCM",
    desc: "BELUGA Catering cung cấp dịch vụ cơm văn phòng chuyên nghiệp tại Quận 1 — trung tâm tài chính TP.HCM. Phục vụ các công ty, văn phòng, tòa nhà văn phòng cao tầng từ 10 đến 1000+ suất/ngày.",
    faqs: [
      { q: "Cơm văn phòng Quận 1 giá bao nhiêu?", a: "Giá từ 85.000đ đến 150.000đ/suất tùy menu. Gói tháng tiết kiệm hơn 5-10%." },
      { q: "Giao hàng khu vực Quận 1 mất bao lâu?", a: "BELUGA giao đúng giờ — 11:00-12:00 trưa. Phục vụ mọi tòa nhà tại Quận 1." },
      { q: "Đặt tối thiểu bao nhiêu suất?", a: "Tối thiểu 10 suất/đơn. Đơn định kỳ hàng ngày được ưu tiên slot cố định." },
    ],
  },
  "com-van-phong-quan-3": {
    name: "Quận 3",
    title: "Dịch Vụ Cơm Văn Phòng Quận 3 TP.HCM",
    desc: "Dịch vụ suất ăn văn phòng tại Quận 3 — khu vực sầm uất với nhiều tòa văn phòng và doanh nghiệp. BELUGA đảm bảo giao hàng đúng giờ, chất lượng chuẩn mỗi ngày.",
    faqs: [
      { q: "BELUGA có phục vụ khu vực Quận 3 không?", a: "Có, BELUGA phủ sóng toàn bộ Quận 3 bao gồm các tuyến đường Võ Thị Sáu, Nam Kỳ Khởi Nghĩa và các phường lân cận." },
      { q: "Menu cơm văn phòng Quận 3 như thế nào?", a: "Thực đơn đa dạng: cơm trưa Việt Nam, eat clean, bento Nhật Bản — thay đổi hàng tuần." },
      { q: "Có thể ký hợp đồng dài hạn không?", a: "Có, hợp đồng tháng/quý/năm với giá ưu đãi 5-15% và slot giao hàng cố định." },
    ],
  },
  "com-van-phong-binh-thanh": {
    name: "Bình Thạnh",
    title: "Dịch Vụ Cơm Văn Phòng Bình Thạnh TP.HCM",
    desc: "Suất ăn văn phòng cao cấp tại Bình Thạnh — quận đang phát triển mạnh với nhiều khu văn phòng và startup. BELUGA phục vụ từ Xô Viết Nghệ Tĩnh đến Phan Văn Trị và toàn quận.",
    faqs: [
      { q: "Cơm văn phòng Bình Thạnh có đắt không?", a: "Giá từ 85.000đ/suất, cạnh tranh nhất khu vực với chất lượng đầu bếp 5 sao." },
      { q: "Giao hàng Bình Thạnh có phụ phí không?", a: "Không có phụ phí giao hàng trong nội quận. Các tuyến xa có thể thêm 5.000đ-10.000đ." },
      { q: "Phục vụ tối đa bao nhiêu suất cho Bình Thạnh?", a: "BELUGA có thể phục vụ không giới hạn — từ 10 đến 2000+ suất/ngày tại Bình Thạnh." },
    ],
  },
  "com-van-phong-go-vap": {
    name: "Gò Vấp",
    title: "Dịch Vụ Cơm Văn Phòng Gò Vấp TP.HCM",
    desc: "BELUGA Catering cung cấp cơm văn phòng tại Gò Vấp — quận dân số đông với nhiều doanh nghiệp vừa và nhỏ. Giao đúng giờ, ngon miệng, phù hợp ngân sách.",
    faqs: [
      { q: "Cơm văn phòng Gò Vấp phục vụ những khu vực nào?", a: "BELUGA phủ sóng toàn Gò Vấp: Nguyễn Văn Khối, Quang Trung, Lê Đức Thọ và tất cả phường." },
      { q: "Thực đơn thay đổi như thế nào?", a: "Thực đơn xoay vòng 14 ngày — không bao giờ lặp lại trong 2 tuần. Cập nhật theo mùa." },
      { q: "Đặt cơm theo ngày hay theo tháng tốt hơn?", a: "Đặt tháng tiết kiệm 5-10% và được ưu tiên slot cố định. Khuyến nghị cho công ty ổn định." },
    ],
  },
  "com-van-phong-thu-duc": {
    name: "Thủ Đức",
    title: "Dịch Vụ Cơm Văn Phòng Thủ Đức TP.HCM",
    desc: "Phục vụ suất ăn văn phòng và cơm trưa tại TP. Thủ Đức — thành phố năng động nhất TP.HCM với nhiều khu công nghệ cao, trường đại học và doanh nghiệp.",
    faqs: [
      { q: "BELUGA phục vụ khu nào ở Thủ Đức?", a: "Toàn TP Thủ Đức: Khu CNC Sài Gòn, ĐHQG, Khu đô thị Vinhomes, Q9, Q2 cũ và Bình Thủ cũ." },
      { q: "Cơm Thủ Đức giao mất bao lâu?", a: "BELUGA đảm bảo giao trước 12:00 trưa. Xuất phát từ bếp trung tâm lúc 10:30." },
      { q: "Có menu eat clean cho IT/tech không?", a: "Có, menu Sức Sống Xanh và menu Eat Clean rất phổ biến với nhân viên khu công nghệ cao." },
    ],
  },
  "com-van-phong-tan-binh": {
    name: "Tân Bình",
    title: "Dịch Vụ Cơm Văn Phòng Tân Bình TP.HCM",
    desc: "Cơm văn phòng tại Tân Bình — khu vực sầm uất gần sân bay Tân Sơn Nhất với nhiều công ty logistics, hàng không và doanh nghiệp xuất nhập khẩu.",
    faqs: [
      { q: "Cơm văn phòng Tân Bình giờ giao như thế nào?", a: "Giao từ 11:00-12:30 trưa. Phục vụ cả ca chiều 17:00-18:00 theo yêu cầu." },
      { q: "Có phục vụ khu vực sân bay Tân Sơn Nhất không?", a: "Có, BELUGA phục vụ toàn khu vực Tân Bình bao gồm khu vực gần sân bay." },
      { q: "Menu nào phù hợp cho công ty logistics 24/7?", a: "BELUGA cung cấp cả ca đêm theo yêu cầu đặc biệt. Liên hệ để tư vấn thêm." },
    ],
  },
  "com-van-phong-binh-duong": {
    name: "Bình Dương",
    title: "Dịch Vụ Cơm Văn Phòng Bình Dương",
    desc: "Suất ăn văn phòng và suất ăn công nghiệp tại Bình Dương — phủ sóng VSIP 1, VSIP 2, KCN Bình Dương, KCN Sóng Thần và toàn tỉnh.",
    faqs: [
      { q: "BELUGA phục vụ KCN nào ở Bình Dương?", a: "Phủ sóng toàn bộ KCN: VSIP 1, VSIP 2, KCN Sóng Thần, KCN Bình Dương, Đại Đăng, Nam Tân Uyên và hơn 20 KCN khác." },
      { q: "Giá suất ăn công nghiệp Bình Dương?", a: "Từ 75.000đ/suất cho gói cơ bản. Hợp đồng 500+ suất/ngày có giá đặc biệt." },
      { q: "Phục vụ tối đa bao nhiêu suất tại Bình Dương?", a: "BELUGA có thể cung cấp 5000+ suất/ngày cho các nhà máy lớn tại Bình Dương." },
    ],
  },
  "com-van-phong-dong-nai": {
    name: "Đồng Nai",
    title: "Dịch Vụ Cơm Văn Phòng Đồng Nai",
    desc: "BELUGA mở rộng phục vụ tại Đồng Nai — suất ăn công nghiệp và cơm văn phòng cho các KCN Biên Hòa, Long Thành, Nhơn Trạch và toàn tỉnh.",
    faqs: [
      { q: "BELUGA có phục vụ KCN Biên Hòa không?", a: "Có, BELUGA phục vụ KCN Biên Hòa 1, 2, KCN Long Thành, KCN Nhơn Trạch và các KCN lân cận." },
      { q: "Xe giao hàng Đồng Nai có chuyên dụng không?", a: "Có, xe tải chuyên dụng cách nhiệt, đảm bảo nhiệt độ thức ăn từ bếp đến nơi giao." },
      { q: "Thời gian đặt hàng Đồng Nai?", a: "Đặt trước 16:00 hôm trước. Đơn định kỳ hàng ngày được lên lịch cố định." },
    ],
  },
};

export default function DistrictPage({ districtSlug }: { districtSlug?: string }) {
  const { district: districtParam } = useParams<{ district: string }>();
  const district = districtSlug ?? districtParam;
  const data = districtData[district ?? ""] ?? {
    name: district?.replace(/com-van-phong-/, "").replace(/-/g, " ") ?? "",
    title: `Dịch Vụ Cơm Văn Phòng ${district?.replace(/com-van-phong-/, "").replace(/-/g, " ") ?? ""}`,
    desc: "BELUGA Catering cung cấp dịch vụ suất ăn văn phòng chuyên nghiệp tại khu vực này. Giao hàng đúng giờ, chất lượng đảm bảo.",
    faqs: [
      { q: "Cơm văn phòng giá bao nhiêu?", a: "Từ 85.000đ/suất. Liên hệ để nhận báo giá theo nhu cầu cụ thể." },
    ],
  };

  const benefits = [
    "Giao hàng đúng giờ 100%",
    "Thực đơn thay đổi hàng tuần",
    "Đầu bếp chứng chỉ VSATTP",
    "Tối thiểu 10 suất/đơn",
    "Ký hợp đồng dài hạn giảm 5-10%",
    "Hotline hỗ trợ 0909 123 456",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <ServiceJsonLd
        name={data.title}
        description={data.desc}
        url={`https://belugacatering.vn/${district}`}
      />
      <FaqJsonLd faqs={data.faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Cơm văn phòng", url: "https://belugacatering.vn/com-van-phong" },
        { name: data.name, url: `https://belugacatering.vn/${district}` },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&q=90" alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
            <span>/</span>
            <Link href="/com-van-phong"><span className="hover:text-white cursor-pointer">Cơm văn phòng</span></Link>
            <span>/</span>
            <span className="text-white">{data.name}</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <MapPin className="w-3.5 h-3.5" /> {data.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{data.title}</h1>
            <p className="text-white/80 text-lg mb-7 leading-relaxed">{data.desc}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking-form" className="bg-primary text-white px-7 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-center">
                Nhận báo giá miễn phí
              </a>
              <a href="tel:0909123456" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> 0909 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Canonical notice */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
        <p className="text-sm text-amber-700">
          Trang này cung cấp thông tin dịch vụ cho khu vực {data.name}.{" "}
          <Link href="/com-van-phong"><span className="font-semibold underline cursor-pointer">Xem trang chính →</span></Link>
        </p>
      </div>

      {/* Benefits */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground">Tại Sao Chọn BELUGA Tại {data.name}?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-foreground text-center mb-8">Câu Hỏi Về Khu Vực {data.name}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <p className="font-bold text-foreground mb-2">{faq.q}</p>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-lg font-bold text-foreground mb-5 text-center">Khám Phá Thêm Dịch Vụ</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Cơm văn phòng TPHCM", href: "/com-van-phong" },
              { label: "Tiệc công ty", href: "/dat-tiec-cong-ty" },
              { label: "Suất ăn công nghiệp", href: "/suat-an-cong-nghiep" },
              { label: "Nấu ăn sự kiện", href: "/dich-vu-nau-an-su-kien" },
              { label: "Xem thực đơn", href: "/menus" },
              { label: "Blog catering", href: "/blog" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="bg-card border border-border rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking-form" className="py-14 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-black text-foreground">Đặt Cơm Văn Phòng Tại {data.name}</h2>
            <p className="text-muted-foreground mt-2 text-sm">Phản hồi trong 2 giờ — Không cần đặt cọc khi tư vấn</p>
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
