import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const photos = [
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85", alt: "Tiệc gala doanh nghiệp" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85", alt: "Thực đơn phong phú" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85", alt: "Không gian buffet" },
  { src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=85", alt: "Cơm văn phòng cao cấp" },
  { src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85", alt: "Món ăn Việt Nam" },
  { src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=85", alt: "Teabreak hội nghị" },
  { src: "https://images.unsplash.com/photo-1563379091339-03246963d69a?w=800&q=85", alt: "Bữa tiệc sự kiện" },
  { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85", alt: "Pizza & Ẩm thực quốc tế" },
];

export default function GallerySection() {
  const [selected, setSelected] = useState<typeof photos[0] | null>(null);

  return (
    <section className="py-20 bg-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Hình ảnh thực tế</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">Chất Lượng Qua Từng Hình Ảnh</h2>
          <p className="text-white/60 max-w-xl mx-auto">Mỗi bữa tiệc là một tác phẩm nghệ thuật — từ cách bày trí đến hương vị</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                i === 0 || i === 5 ? "md:row-span-2" : ""
              }`}
              style={{ aspectRatio: (i === 0 || i === 5) ? "1/2" : "1/1" }}
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-3 text-center">
                  {photo.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelected(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selected.src}
              alt={selected.alt}
              className="max-w-4xl w-full max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
