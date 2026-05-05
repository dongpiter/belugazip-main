import { Link } from "wouter";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface Menu {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price_per_person: number;
  image_url?: string | null;
  tag?: string | null;
  category: string;
  min_guests?: number | null;
  is_featured?: boolean | null;
}

interface MenuCardProps {
  menu: Menu;
  index?: number;
}

const categoryLabels: Record<string, string> = {
  office: "Văn phòng",
  event: "Sự kiện",
  vegan: "Chay",
  teabreak: "Teabreak",
  buffet: "Buffet",
};

export default function MenuCard({ menu, index = 0 }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link href={`/menus/${menu.slug}`}>
        <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
          <div className="relative overflow-hidden h-52">
            <img
              src={menu.image_url ?? `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80`}
              alt={menu.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              {menu.tag && (
                <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {menu.tag}
                </span>
              )}
              {menu.is_featured && (
                <span className="bg-secondary text-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                  Nổi bật
                </span>
              )}
            </div>
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
              {categoryLabels[menu.category] ?? menu.category}
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {menu.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
              {menu.description}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-primary">{formatVND(menu.price_per_person)}</p>
                <p className="text-xs text-muted-foreground">/ người</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {menu.min_guests && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    Min {menu.min_guests} người
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
