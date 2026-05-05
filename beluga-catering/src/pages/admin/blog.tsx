import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { useListAdminBlogPosts, useDeleteBlogPost } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  is_published?: boolean | null;
  view_count?: number | null;
  reading_time?: number | null;
  published_at?: string | null;
  created_at?: string | null;
};

export default function AdminBlog() {
  const [filter, setFilter] = useState("");
  const { data, isLoading, refetch } = useListAdminBlogPosts();
  const deletePost = useDeleteBlogPost();

  const posts = ((data as Post[] | undefined) ?? []).filter((p) =>
    filter === "" ? true : filter === "published" ? p.is_published : !p.is_published
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    try {
      await deletePost.mutateAsync({ id });
      toast.success("Đã xóa bài viết");
      refetch();
    } catch {
      toast.error("Lỗi xóa bài viết");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý nội dung blog</p>
        </div>
        <Link href="/admin/blog/new">
          <span className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />Tạo bài mới
          </span>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {[["", "Tất cả"], ["published", "Đã xuất bản"], ["draft", "Nháp"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === k ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:border-primary/30"}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tiêu đề</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Danh mục</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Trạng thái</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ngày tạo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground line-clamp-1">{post.title}</div>
                      <div className="text-xs text-muted-foreground">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{post.category ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{post.view_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-semibold w-fit px-2.5 py-1 rounded-full ${post.is_published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {post.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.is_published ? "Đã xuất bản" : "Nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <span className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer block">
                            <Pencil className="w-4 h-4" />
                          </span>
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Chưa có bài viết nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
