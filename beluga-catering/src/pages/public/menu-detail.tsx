import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Users, Flame, Dumbbell, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";
import { useGetMenuBySlug } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";

type Menu = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  long_description?: string | null;
  price_per_person: number;
  image_url?: string | null;
  banner_url?: string | null;
  tag?: string | null;
  category: string;
  min_guests?: number | null;
  is_featured?: boolean | null;
  dishes?: Array<{ name: string; description: string }> | null;
  nutrition_calories?: number | null;
  nutrition_protein?: number | null;
  nutrition_fat?: number | null;
  nutrition_carbs?: number | null;
  faqs?: Array<{ q: string; a: string }> | null;
  target_audience?: string | null;
};

export default function MenuDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: menu, isLoading } = useGetMenuBySlug(slug ?? "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const m = menu as Menu | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 h-[60vh] flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
            <div className="h-8 bg-muted rounded-xl w-2/3" />
            <div className="h-4 bg-muted rounded-xl w-full" />
            <div className="h-4 bg-muted rounded-xl w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 h-[60vh] flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Menu không tìm thấy</h2>
            <Link href="/menus"><span className="text-primary cursor-pointer">Quay lại danh sách menu</span></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-72 md:h-96 mt-0 pt-16 overflow-hidden">
        <img
          src={m.banner_url ?? m.image_url ?? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90"}
          alt={m.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Link href="/"><span className="hover:text-white cursor-pointer">Trang chủ</span></Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/menus"><span className="hover:text-white cursor-pointer">Thực đơn</span></Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">{m.name}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{m.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              {m.tag && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{m.tag}</span>}
              <span className="text-secondary font-black text-2xl">{formatVND(m.price_per_person)}<span className="text-white/60 text-sm font-normal">/người</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-foreground mb-4">Giới thiệu</h2>
            <p className="text-muted-foreground leading-relaxed">{m.long_description ?? m.description}</p>
            {m.target_audience && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Phù hợp: <strong className="text-foreground">{m.target_audience}</strong></span>
              </div>
            )}
          </motion.div>

          {/* Dishes */}
          {m.dishes && (m.dishes as Array<{ name: string; description: string }>).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-black text-foreground mb-4">Các món trong thực đơn</h2>
              <div className="space-y-3">
                {(m.dishes as Array<{ name: string; description: string }>).map((dish, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{dish.name}</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">{dish.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Nutrition */}
          {m.nutrition_calories && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-2xl font-black text-foreground mb-4">Thông tin dinh dưỡng</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Flame, label: "Calories", value: `${m.nutrition_calories} kcal`, color: "text-orange-500" },
                  { icon: Dumbbell, label: "Protein", value: `${m.nutrition_protein}g`, color: "text-blue-500" },
                  { icon: Clock, label: "Chất béo", value: `${m.nutrition_fat}g`, color: "text-yellow-500" },
                  { icon: Clock, label: "Carbs", value: `${m.nutrition_carbs}g`, color: "text-green-500" },
                ].map((n) => (
                  <div key={n.label} className="bg-card rounded-xl p-4 border border-border text-center">
                    <n.icon className={`w-6 h-6 ${n.color} mx-auto mb-2`} />
                    <p className="text-xl font-black text-foreground">{n.value}</p>
                    <p className="text-xs text-muted-foreground">{n.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAQs */}
          {m.faqs && (m.faqs as Array<{ q: string; a: string }>).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-black text-foreground mb-4">Câu hỏi thường gặp</h2>
              <div className="space-y-2">
                {(m.faqs as Array<{ q: string; a: string }>).map((faq, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-muted-foreground text-sm border-t border-border pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="mb-5 pb-5 border-b border-border">
                <p className="text-muted-foreground text-sm mb-1">Giá từ</p>
                <p className="text-3xl font-black text-primary">{formatVND(m.price_per_person)}</p>
                <p className="text-sm text-muted-foreground">/ người (tối thiểu {m.min_guests ?? 10} người)</p>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-4">Đặt tiệc ngay</h3>
              <BookingForm preselectedMenuId={m.id} preselectedMenuName={m.name} preselectedMenuPrice={m.price_per_person} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
