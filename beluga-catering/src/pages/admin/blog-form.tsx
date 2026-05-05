import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import TipTapEditor from "@/components/admin/TipTapEditor";
import { useListAdminBlogPosts, useCreateBlogPost, useUpdateBlogPost, useGenerateBlog } from "@workspace/api-client-react";
import { ChevronLeft, Loader2, Sparkles, Eye, Clock, Tag, Calculator } from "lucide-react";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function calcReadingTime(html: string): number {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

import { toast } from "sonner";

type PostRow = {
  id: string; title: string; slug: string; content?: string | null;
  excerpt?: string | null; category?: string | null; featured_image?: string | null;
  meta_title?: string | null; meta_description?: string | null;
  is_published?: boolean | null; reading_time?: number | null; tags?: string[] | null
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  const [, navigate] = useLocation();

  const { data: allPosts } = useListAdminBlogPosts();
  const existingPost = isEdit ? (allPosts as PostRow[] | undefined)?.find((p) => p.id === id) : undefined;

  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", category: "", featured_image: "",
    meta_title: "", meta_description: "", is_published: false, reading_time: 5, tags: "",
  });

  const [aiTopic, setAiTopic] = useState("");

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title ?? "",
        slug: existingPost.slug ?? "",
        content: existingPost.content ?? "",
        excerpt: existingPost.excerpt ?? "",
        category: existingPost.category ?? "",
        featured_image: existingPost.featured_image ?? "",
        meta_title: existingPost.meta_title ?? "",
        meta_description: existingPost.meta_description ?? "",
        is_published: existingPost.is_published ?? false,
        reading_time: existingPost.reading_time ?? 5,
        tags: (existingPost.tags ?? []).join(", "),
      });
    }
  }, [existingPost]);

  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const generateBlog = useGenerateBlog();

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }));
  };

  const handleContentChange = (html: string) => {
    const rt = calcReadingTime(html);
    setForm((f) => ({ ...f, content: html, reading_time: rt }));
  };

  const handleAIDraft = async () => {
    if (!aiTopic && !form.title) {
      toast.error("Nhập chủ đề hoặc tiêu đề để AI tạo nội dung");
      return;
    }
    try {
      const result = await generateBlog.mutateAsync({
        data: {
          topic: aiTopic || form.title,
          keywords: [form.title, "catering TPHCM"],
          category: form.category || "kinh-nghiem-suat-an",
        }
      });
      const r = result as { title?: string; content?: string; excerpt?: string; meta_title?: string; meta_description?: string; tags?: string[]; reading_time?: number };
      setForm((f) => ({
        ...f,
        title: r.title ?? f.title,
        slug: slugify(r.title ?? f.title),
        content: r.content ?? f.content,
        excerpt: r.excerpt ?? f.excerpt,
        meta_title: r.meta_title ?? f.meta_title,
        meta_description: r.meta_description ?? f.meta_description,
        tags: (r.tags ?? []).join(", "),
        reading_time: r.reading_time ?? f.reading_time,
      }));
      toast.success("AI đã tạo nội dung thành công!");
    } catch {
      toast.error("Lỗi khi tạo nội dung AI");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await updatePost.mutateAsync({ id: id!, data: payload as Parameters<typeof updatePost.mutateAsync>[0]["data"] });
        toast.success("Đã cập nhật bài viết");
      } else {
        await createPost.mutateAsync({ data: payload as Parameters<typeof createPost.mutateAsync>[0]["data"] });
        toast.success("Đã tạo bài viết mới");
      }
      navigate("/admin/blog");
    } catch {
      toast.error("Lỗi lưu bài viết");
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;
  const tagList = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog">
          <span className="p-2 bg-card border border-border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </span>
        </Link>
        <h1 className="text-2xl font-black text-foreground">{isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>
      </div>

      {/* AI Draft */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">AI Blog Writer</h3>
        </div>
        <div className="flex gap-3">
          <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Chủ đề bài viết (vd: xu hướng catering 2025)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white" />
          <button type="button" onClick={handleAIDraft} disabled={generateBlog.isPending}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
            {generateBlog.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Đang tạo...</> : <><Sparkles className="w-4 h-4" />Tạo với AI</>}
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left: Form (60%) */}
        <form onSubmit={handleSubmit} className="flex-[3] space-y-5 min-w-0">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Thông tin bài viết</h3>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tiêu đề *</label>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Danh mục</label>
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="thuc-don-moi-ngay, meo-to-chuc-tiec..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Ảnh featured (URL)</label>
              <input value={form.featured_image} onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tóm tắt</label>
              <TipTapEditor
                content={form.excerpt}
                onChange={(html) => setForm((f) => ({ ...f, excerpt: html }))}
                placeholder="Tóm tắt ngắn về bài viết..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nội dung</label>
              <TipTapEditor
                content={form.content}
                onChange={handleContentChange}
                placeholder="Nội dung chi tiết bài viết..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tags (cách nhau bằng dấu phẩy)</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Thời gian đọc
                  <span className="text-xs text-muted-foreground font-normal ml-1">(tự tính từ nội dung)</span>
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/20 text-sm">
                  <Calculator className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{form.reading_time}</span>
                  <span className="text-muted-foreground">phút đọc</span>
                  <span className="text-xs text-muted-foreground ml-auto">≈ {Math.round(form.reading_time * 200)} từ</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Meta Title</label>
              <input value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Meta Description</label>
              <textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="accent-primary" />
              <span className="text-sm font-medium">Xuất bản ngay</span>
            </label>
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={isPending}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Đang lưu...</> : (isEdit ? "Cập nhật" : "Tạo bài viết")}
            </button>
            <Link href="/admin/blog">
              <span className="px-8 py-3 rounded-xl font-bold border border-border text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer block">Hủy</span>
            </Link>
          </div>
        </form>

        {/* Right: Live Preview (40%) */}
        <div className="flex-[2] sticky top-6 space-y-4 min-w-0">
          {/* Article Preview */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Xem trước bài viết</span>
            </div>

            <div className="p-4 space-y-3">
              {/* Featured image */}
              {form.featured_image ? (
                <img src={form.featured_image} alt={form.title} className="w-full h-36 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-36 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                  Chưa có ảnh featured
                </div>
              )}

              {/* Category badge */}
              {form.category && (
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                  {form.category}
                </span>
              )}

              {/* Title */}
              <h2 className="font-black text-foreground text-base leading-snug line-clamp-3">
                {form.title || "Tiêu đề bài viết..."}
              </h2>

              {/* Excerpt */}
              {form.excerpt && (
                <div
                  className="text-sm text-muted-foreground line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.excerpt }}
                />
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{form.reading_time} phút đọc
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${form.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {form.is_published ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </div>

              {/* Tags */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tagList.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO Preview */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
            <h4 className="text-sm font-bold text-foreground mb-3">Google Preview</h4>
            <div className="bg-muted/20 rounded-xl p-3 space-y-1">
              <p className="text-[13px] text-blue-600 font-medium line-clamp-1">
                belugacatering.vn/blog/{form.slug || "slug-bai-viet"}
              </p>
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {form.meta_title || form.title || "Meta title..."}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {form.meta_description || "Meta description sẽ hiển thị tại đây..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
