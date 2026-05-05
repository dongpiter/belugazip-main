import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Calendar, User, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import { useGetBlogPost, useListBlogPosts } from "@workspace/api-client-react";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const categoryLabels: Record<string, string> = {
  "thuc-don-moi-ngay": "Thực đơn mỗi ngày",
  "kinh-nghiem-suat-an": "Kinh nghiệm suất ăn",
  "meo-to-chuc-tiec": "Mẹo tổ chức tiệc",
  "dinh-duong-suc-khoe": "Dinh dưỡng sức khỏe",
};

const internalLinks: Record<string, { label: string; href: string }[]> = {
  "thuc-don-moi-ngay": [
    { label: "Cơm văn phòng", href: "/com-van-phong" },
    { label: "Xem thực đơn", href: "/menus" },
  ],
  "kinh-nghiem-suat-an": [
    { label: "Suất ăn công nghiệp", href: "/suat-an-cong-nghiep" },
    { label: "Cơm văn phòng", href: "/com-van-phong" },
  ],
  "meo-to-chuc-tiec": [
    { label: "Đặt tiệc công ty", href: "/dat-tiec-cong-ty" },
    { label: "Nấu ăn sự kiện", href: "/dich-vu-nau-an-su-kien" },
  ],
  "dinh-duong-suc-khoe": [
    { label: "Cơm văn phòng", href: "/com-van-phong" },
    { label: "Xem thực đơn", href: "/menus" },
  ],
};

type Post = {
  id: string;
  slug: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  featured_image?: string | null;
  category?: string | null;
  reading_time?: number | null;
  published_at?: string | null;
  author?: string | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug ?? "");
  const p = post as Post | undefined;

  const { data: allPosts } = useListBlogPosts();
  const postsData = allPosts as { posts?: Post[] } | undefined;
  const posts = postsData?.posts;

  const relatedPosts = posts
    ?.filter((rp) => rp.slug !== slug && rp.category === p?.category)
    .slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-3xl mx-auto px-4 space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded-xl w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded-xl w-full" />
          <div className="h-72 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center h-[60vh] text-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Bài viết không tồn tại</h2>
            <Link href="/blog"><span className="text-primary cursor-pointer">Quay lại blog</span></Link>
          </div>
        </div>
      </div>
    );
  }

  const pageUrl = `https://belugacatering.vn/blog/${p.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />
      <BlogPostJsonLd
        title={p.title}
        description={p.excerpt ?? undefined}
        image={p.featured_image ?? undefined}
        author={p.author ?? undefined}
        datePublished={p.published_at ?? undefined}
        url={pageUrl}
      />
      <BreadcrumbJsonLd items={[
        { name: "Trang chủ", url: "https://belugacatering.vn" },
        { name: "Blog", url: "https://belugacatering.vn/blog" },
        { name: p.title, url: pageUrl },
      ]} />

      <div className="pt-16">
        {p.featured_image && (
          <div className="relative h-64 md:h-[420px] overflow-hidden">
            <img src={p.featured_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/"><span className="hover:text-foreground cursor-pointer">Trang chủ</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog"><span className="hover:text-foreground cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground line-clamp-1">{p.title}</span>
          </div>

          {p.category && (
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {categoryLabels[p.category] ?? p.category.replace(/-/g, " ")}
            </span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-foreground mt-2 mb-4 leading-tight"
          >
            {p.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {p.author ?? "BELUGA Team"}
            </span>
            {p.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(p.published_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {p.reading_time ?? 5} phút đọc
            </span>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: p.content ?? "" }}
          />

          {/* Internal links */}
          {p.category && internalLinks[p.category] && (
            <div className="mt-10 p-5 bg-muted/30 rounded-2xl border border-border">
              <p className="text-sm font-bold text-foreground mb-3">Xem thêm dịch vụ liên quan:</p>
              <div className="flex flex-wrap gap-2">
                {internalLinks[p.category].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="inline-flex items-center gap-1.5 bg-white border border-border text-primary text-sm font-semibold px-4 py-2 rounded-full hover:border-primary/40 transition-colors cursor-pointer">
                      {link.label} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {p.tags && p.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />Tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-black text-foreground text-xl mb-2">Cần dịch vụ catering?</h3>
            <p className="text-muted-foreground text-sm mb-4">BELUGA Catering sẵn sàng tư vấn và báo giá miễn phí cho mọi nhu cầu của bạn.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/#booking-form">
                <span className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                  Nhận báo giá ngay
                </span>
              </Link>
              <a href="tel:0909123456" className="inline-block border border-border text-foreground px-6 py-3 rounded-full font-semibold text-sm hover:border-primary/40 transition-colors">
                Gọi 0909 123 456
              </a>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-14 bg-muted/20 border-t border-border">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-black text-foreground mb-8 text-center">Bài Viết Liên Quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp, i) => (
                  <motion.div
                    key={rp.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {rp.featured_image && (
                      <img src={rp.featured_image} alt={rp.title} className="w-full h-40 object-cover" loading="lazy" />
                    )}
                    <div className="p-4">
                      {rp.category && (
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {categoryLabels[rp.category] ?? rp.category}
                        </span>
                      )}
                      <h3 className="font-bold text-foreground mt-1 mb-2 text-sm line-clamp-2 leading-snug">{rp.title}</h3>
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{rp.excerpt}</p>
                      <Link href={`/blog/${rp.slug}`}>
                        <span className="text-primary text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1">
                          Đọc thêm <ChevronRight className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
