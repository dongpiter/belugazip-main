import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "wouter";

type Tier = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export default function PricingTiers({ tiers }: { tiers: Tier[] }) {
  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Bảng giá dịch vụ</span>
          <h2 className="text-3xl font-black text-foreground mt-2 mb-3">3 Gói Phù Hợp Mọi Ngân Sách</h2>
          <p className="text-muted-foreground text-sm">Giá đã bao gồm vận chuyển · VAT theo quy định</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-3xl p-6 border-2 ${
                tier.highlight
                  ? "border-primary bg-primary text-white shadow-2xl shadow-primary/25 scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {tier.badge && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap ${
                  tier.highlight ? "bg-secondary text-foreground" : "bg-primary text-white"
                }`}>
                  {tier.badge}
                </span>
              )}

              <div className="mb-5">
                <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                  {tier.name}
                </p>
                <p className={`text-3xl font-black mb-1 ${tier.highlight ? "text-white" : "text-foreground"}`}>
                  {tier.price}
                </p>
                <p className={`text-sm ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>{tier.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-7">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      tier.highlight ? "bg-white/20" : "bg-primary/10"
                    }`}>
                      <Check className={`w-3 h-3 ${tier.highlight ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className={`text-sm leading-relaxed ${tier.highlight ? "text-white/90" : "text-foreground"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/#booking-form">
                <span className={`block text-center py-3 rounded-full font-bold text-sm cursor-pointer transition-colors ${
                  tier.highlight
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}>
                  Đặt gói này ngay
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Cần tùy chỉnh đặc biệt? <a href="tel:0909123456" className="text-primary font-semibold">Gọi ngay 0909 123 456</a> để được báo giá riêng.
        </p>
      </div>
    </section>
  );
}
