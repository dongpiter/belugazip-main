import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { useListBlogPosts } from "@workspace/api-client-react";

const categories = [
  { key: "", label: "Tất cả" },
  { key: "thuc-don-moi-ngay", label: "Thực đơn mỗi ngày" },
  { key: "kinh-nghiem-suat-an", label: "Kinh nghiệm" },
  { key: "meo-to-chuc-tiec", label: "Mẹo tổ chức tiệc" },
  { key: "dinh-duong-suc-khoe", label: "Dinh dưỡng" },
];

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image?: string | null;
  category?: string | null;
  reading_time?: number | null;
  published_at?: string | null;
  author?: string | null;
};

export default function Blog() {
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListBlogPosts({ category: category || undefined, page, limit: 9 } as Parameters<typeof useListBlogPosts>[0]);
  const result = data as { posts: Post[]; total: number; page: number; limit: number } | undefined;
  const posts = result?.posts ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-10 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Kiến thức catering</span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mt-2 mb-4">Blog BELUGA</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Chia sẻ kiến thức về dinh dưỡng, tổ chức sự kiện và xu hướng ẩm thực doanh nghiệp</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setCategory(cat.key); setPage(1); }}
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featured_image ?? "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.category.replace(/-/g, " ")}</span>
                      )}
                      <h3 className="font-bold text-foreground text-lg mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.reading_time ?? 5} phút đọc
                        </div>
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          Đọc tiếp <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
