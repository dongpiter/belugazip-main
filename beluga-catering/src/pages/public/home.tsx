import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Star, ChevronRight, Utensils, Building2, Factory, ChefHat } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import GallerySection from "@/components/GallerySection";
import MenuRecommender from "@/components/MenuRecommender";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { useListMenus, useGetAllSettings, useTrackAbImpression, useTrackAbClick } from "@workspace/api-client-react";

const stats = [
  { value: "500+", label: "Sự kiện thành công" },
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "100%", label: "Giao hàng đúng giờ" },
  { value: "8+", label: "Năm kinh nghiệm" },
];

const services = [
  { icon: Building2, title: "Cơm Văn Phòng", desc: "Suất ăn eat clean cân bằng dinh dưỡng, giao tận nơi hàng ngày", href: "/com-van-phong", price: "Từ 85.000đ/suất" },
  { icon: Utensils, title: "Tiệc Công Ty", desc: "Tiệc tất niên, gala dinner, hội nghị từ 20 đến 500 người", href: "/dat-tiec-cong-ty", price: "Từ 180.000đ/người" },
  { icon: Factory, title: "Suất Ăn Công Nghiệp", desc: "Giải pháp bữa ăn cho nhà máy, khu công nghiệp", href: "/suat-an-cong-nghiep", price: "Từ 75.000đ/suất" },
  { icon: ChefHat, title: "Nấu Ăn Sự Kiện", desc: "Đầu bếp chuyên nghiệp phục vụ tại địa điểm của bạn", href: "/dich-vu-nau-an-su-kien", price: "Liên hệ báo giá" },
];

const testimonials = [
  { name: "Nguyễn Thành Nam", role: "HR Manager — TechCorp Vietnam", text: "BELUGA đã phục vụ bữa trưa cho 80 nhân viên công ty chúng tôi suốt 2 năm. Chất lượng ổn định, đúng giờ 100%.", rating: 5 },
  { name: "Trần Thị Hoa", role: "Event Manager — ABC Events", text: "Tiệc tất niên 300 người của chúng tôi diễn ra hoàn hảo. Đội ngũ BELUGA chuyên nghiệp và tận tâm đến từng chi tiết.", rating: 5 },
  { name: "Lê Văn Minh", role: "CEO — Startup Founders HCM", text: "Teabreak hội nghị luôn được khách mời khen ngợi. BELUGA hiểu được tiêu chuẩn của doanh nghiệp B2B.", rating: 5 },
];

const processSteps = [
  { step: "01", title: "Liên hệ & Tư vấn", desc: "Gọi điện hoặc điền form — chúng tôi phản hồi trong 2 giờ" },
  { step: "02", title: "Thiết kế thực đơn", desc: "Tùy chỉnh menu theo yêu cầu, ngân sách và số lượng khách" },
  { step: "03", title: "Xác nhận & Chuẩn bị", desc: "Ký hợp đồng, đặt cọc 30%, chúng tôi chuẩn bị từ A-Z" },
  { step: "04", title: "Phục vụ tận nơi", desc: "Đội ngũ có mặt đúng giờ, phục vụ chuyên nghiệp đến hết sự kiện" },
];

const localPages = [
  { label: "Cơm VP Quận 1", href: "/com-van-phong-quan-1" },
  { label: "Cơm VP Quận 3", href: "/com-van-phong-quan-3" },
  { label: "Cơm VP Bình Thạnh", href: "/com-van-phong-binh-thanh" },
  { label: "Cơm VP Gò Vấp", href: "/com-van-phong-go-vap" },
  { label: "Cơm VP Thủ Đức", href: "/com-van-phong-thu-duc" },
  { label: "Cơm VP Tân Bình", href: "/com-van-phong-tan-binh" },
  { label: "Cơm VP Bình Dương", href: "/com-van-phong-binh-duong" },
  { label: "Cơm VP Đồng Nai", href: "/com-van-phong-dong-nai" },
];

function AnimatedCounter({ target }: { target: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {target}
    </span>
  );
}

export default function Home() {
  const { data: menus } = useListMenus({ featured: true });
  const { data: settings } = useGetAllSettings();
  const trackImpression = useTrackAbImpression();
  const trackClick = useTrackAbClick();

  const siteSettings = settings as Record<string, unknown> | undefined;
  const abConfig = siteSettings?.ab_hero_cta as { active_variant: string; variant_A: string; variant_B: string } | undefined;
  const ctaText = abConfig?.active_variant === "B" ? (abConfig?.variant_B ?? "Nhận báo giá miễn phí") : (abConfig?.variant_A ?? "Đặt tiệc ngay");

  useEffect(() => {
    if (abConfig?.active_variant) {
      trackImpression.mutate({ data: { test_name: "hero_cta", variant: abConfig.active_variant } });
    }
  }, [abConfig?.active_variant]);

  const featuredMenus = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90"
            alt="BELUGA Catering — Dịch vụ catering cao cấp tại TP.HCM"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block bg-primary/90 text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
              Catering cao cấp tại TP.HCM
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05]"
          >
            BELUGA — Tinh Hoa Ẩm Thực<br />
            <span className="text-secondary">Tận Nơi Trọn Vẹn</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Suất ăn văn phòng cao cấp & tiệc sự kiện trọn gói tại TP.HCM. Hơn 500 sự kiện thành công — đúng giờ 100%.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#booking-form"
              onClick={() => abConfig?.active_variant && trackClick.mutate({ data: { test_name: "hero_cta", variant: abConfig.active_variant } })}
              className="bg-primary text-white px-8 py-4 rounded-full text-base font-bold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 w-full sm:w-auto"
            >
              {ctaText}
            </a>
            <Link href="/menus">
              <span className="border-2 border-secondary text-white px-8 py-4 rounded-full text-base font-bold hover:bg-white/10 transition-colors w-full sm:w-auto inline-block">
                Xem thực đơn
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/20"
              >
                <div className="text-2xl md:text-3xl font-black text-white mb-1">
                  <AnimatedCounter target={s.value} />
                </div>
                <div className="text-white/70 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Dịch vụ của chúng tôi</span>
            <h2 className="text-4xl font-black text-foreground mt-2 mb-4">Giải Pháp Catering Toàn Diện</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Từ bữa trưa văn phòng hàng ngày đến tiệc gala hoành tráng — BELUGA có giải pháp cho mọi nhu cầu</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={svc.href}>
                  <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <svc.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-2">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{svc.desc}</p>
                    <p className="text-primary font-bold text-sm">{svc.price}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem thêm <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menus */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Thực đơn nổi bật</span>
            <h2 className="text-4xl font-black text-foreground mt-2 mb-4">Menu Được Yêu Thích Nhất</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Được tuyển chọn từ hơn 30 menu, phù hợp mọi dịch vụ và ngân sách</p>
          </motion.div>

          {/* AI Menu Recommender */}
          <MenuRecommender />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredMenus.map((menu, i) => (
              <MenuCard key={menu.id} menu={menu} index={i} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/menus">
              <span className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                Xem tất cả thực đơn <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Quy trình làm việc</span>
            <h2 className="text-4xl font-black text-foreground mt-2">Đơn Giản — Nhanh Chóng — Chuyên Nghiệp</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg shadow-primary/20">
                  {p.step}
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-secondary/40" />
                )}
                <h3 className="font-bold text-foreground text-lg mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Khách hàng nói gì</span>
            <h2 className="text-4xl font-black text-white mt-2">Hơn 500 Doanh Nghiệp Tin Tưởng</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-white/60 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection />

      {/* Booking Form */}
      <section id="booking-form" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Đặt dịch vụ</span>
            <h2 className="text-4xl font-black text-foreground mt-2 mb-3">Nhận Báo Giá Trong 2 Giờ</h2>
            <p className="text-muted-foreground">Điền thông tin bên dưới — chúng tôi sẽ liên hệ ngay để tư vấn chi tiết</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl border-2 border-secondary/30 p-8 shadow-xl shadow-primary/5"
          >
            <BookingForm />
          </motion.div>
        </div>
      </section>

      {/* Local Area Links */}
      <section className="py-12 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5">
            Cơm văn phòng theo khu vực
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {localPages.map((p) => (
              <Link key={p.href} href={p.href}>
                <span className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer">
                  {p.label}
                </span>
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
