import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import ChatWidget from "@/components/ChatWidget";
import { useListMenus } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";

const categories = [
  { key: "all", label: "Tất cả" },
  { key: "office", label: "Văn phòng" },
  { key: "event", label: "Sự kiện" },
  { key: "vegan", label: "Chay" },
  { key: "teabreak", label: "Teabreak" },
  { key: "buffet", label: "Buffet" },
];

export default function Menus() {
  const [category, setCategory] = useState("all");
  const [maxBudget, setMaxBudget] = useState(500000);

  const { data: menus, isLoading } = useListMenus();

  const filtered = (menus as Array<{ id: string; slug: string; name: string; description?: string | null; price_per_person: number; image_url?: string | null; tag?: string | null; category: string; min_guests?: number | null; is_featured?: boolean | null }> | undefined)?.filter((m) => {
    if (category !== "all" && m.category !== category) return false;
    if (m.price_per_person > maxBudget) return false;
    return true;
  }) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-10 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Khám phá</span>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mt-2 mb-4">Thực Đơn BELUGA</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Hơn 30 menu cao cấp được thiết kế riêng cho từng loại sự kiện và nhu cầu của doanh nghiệp bạn</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === cat.key
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 min-w-[220px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Ngân sách tối đa:</span>
            <div className="flex-1">
              <input
                type="range" min={50000} max={500000} step={10000} value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-sm font-bold text-primary text-right">{formatVND(maxBudget)}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">—</p>
            <p className="text-muted-foreground">Không tìm thấy menu phù hợp. Thử điều chỉnh bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((menu, i) => (
              <MenuCard key={menu.id} menu={menu} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
