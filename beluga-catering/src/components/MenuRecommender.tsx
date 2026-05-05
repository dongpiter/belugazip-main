import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Loader2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useRecommendMenu } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";

type Recommendation = {
  menu_id: string;
  menu_name: string;
  reason: string;
  match_score: number;
  price_per_person: number;
  image_url?: string;
  slug?: string;
};

const serviceTypes = [
  "Cơm văn phòng hàng ngày",
  "Tiệc tất niên / cuối năm",
  "Hội nghị / Teabreak",
  "Buffet sự kiện",
  "Suất ăn công nghiệp",
  "Tiệc khai trương",
];

const dietaryOptions = [
  "Không yêu cầu đặc biệt",
  "Có người ăn chay",
  "Không hải sản",
  "Halal",
  "Eat clean / ít dầu mỡ",
];

export default function MenuRecommender() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");
  const [form, setForm] = useState({
    guest_count: "",
    service_type: "Cơm văn phòng hàng ngày",
    budget_per_person: "",
    dietary_preference: "Không yêu cầu đặc biệt",
    event_type: "",
  });

  const recommend = useRecommendMenu();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recommend.mutateAsync({ data: form } as Parameters<typeof recommend.mutateAsync>[0]);
    setStep("result");
  };

  const results = (recommend.data as Recommendation[] | undefined) ?? [];

  return (
    <div className="mb-10">
      <button
        onClick={() => { setOpen(!open); setStep("form"); }}
        className="w-full flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl px-6 py-4 hover:from-primary/15 hover:to-secondary/15 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">AI Gợi Ý Thực Đơn</p>
            <p className="text-muted-foreground text-sm">Trả lời 3 câu hỏi — nhận gợi ý phù hợp nhất</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-primary/10 border-t-0 rounded-b-2xl p-6">
              {step === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Số lượng khách</label>
                      <input
                        type="number"
                        placeholder="VD: 50"
                        value={form.guest_count}
                        onChange={(e) => setForm({ ...form, guest_count: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Ngân sách/người (đ)</label>
                      <input
                        type="number"
                        placeholder="VD: 150000"
                        value={form.budget_per_person}
                        onChange={(e) => setForm({ ...form, budget_per_person: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Loại dịch vụ</label>
                    <div className="relative">
                      <select
                        value={form.service_type}
                        onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none"
                      >
                        {serviceTypes.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Yêu cầu đặc biệt</label>
                    <div className="relative">
                      <select
                        value={form.dietary_preference}
                        onChange={(e) => setForm({ ...form, dietary_preference: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none"
                      >
                        {dietaryOptions.map((d) => <option key={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={recommend.isPending || !form.guest_count}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                  >
                    {recommend.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />AI đang phân tích...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" />Gợi ý thực đơn phù hợp</>
                    )}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-foreground">Gợi ý từ AI BELUGA</h3>
                    <button onClick={() => setStep("form")} className="text-sm text-primary hover:underline">
                      Tìm lại
                    </button>
                  </div>
                  {results.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">Không tìm thấy menu phù hợp. Thử điều chỉnh yêu cầu.</p>
                  ) : (
                    <div className="space-y-4">
                      {results.map((rec, i) => (
                        <motion.div
                          key={rec.menu_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                        >
                          {rec.image_url && (
                            <img src={rec.image_url} alt={rec.menu_name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-foreground text-sm leading-tight">{rec.menu_name}</h4>
                              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                                rec.match_score >= 85 ? "bg-green-100 text-green-700" :
                                rec.match_score >= 70 ? "bg-amber-100 text-amber-700" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {rec.match_score}% phù hợp
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{rec.reason}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-primary font-black text-base">{formatVND(rec.price_per_person)}<span className="text-muted-foreground font-normal text-xs">/người</span></span>
                              <Link href={`/menus/${rec.menu_id}`}>
                                <span className="flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer hover:underline">
                                  Xem chi tiết <ExternalLink className="w-3 h-3" />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
