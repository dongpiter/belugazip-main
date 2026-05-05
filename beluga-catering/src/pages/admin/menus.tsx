import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { useListAdminMenus, useDeleteMenu, useUpdateMenu } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";

type Menu = {
  id: string;
  name: string;
  slug: string;
  price_per_person: number;
  category: string;
  image_url?: string | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  lead_count?: number | null;
  view_count?: number | null;
};

const categoryLabels: Record<string, string> = {
  office: "Văn phòng", event: "Sự kiện", vegan: "Chay", teabreak: "Teabreak", buffet: "Buffet",
};

export default function AdminMenus() {
  const { data, isLoading, refetch } = useListAdminMenus();
  const menus = (data as Menu[] | undefined) ?? [];
  const deleteMenu = useDeleteMenu();
  const updateMenu = useUpdateMenu();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa menu "${name}"?`)) return;
    try {
      await deleteMenu.mutateAsync({ id });
      toast.success("Đã xóa menu");
      refetch();
    } catch {
      toast.error("Lỗi xóa menu");
    }
  };

  const handleToggle = async (menu: Menu, field: "is_active" | "is_featured") => {
    try {
      await updateMenu.mutateAsync({ id: menu.id, data: { name: menu.name, slug: menu.slug, price_per_person: menu.price_per_person, category: menu.category, [field]: !menu[field] } });
      toast.success("Đã cập nhật");
      refetch();
    } catch {
      toast.error("Lỗi cập nhật");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Thực đơn</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý tất cả menu catering</p>
        </div>
        <Link href="/admin/menus/new">
          <span className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />Thêm menu
          </span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Menu</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Danh mục</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Giá</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views / Leads</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Hiển thị</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nổi bật</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {menu.image_url && (
                          <img src={menu.image_url} alt={menu.name} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-medium text-foreground">{menu.name}</div>
                          <div className="text-xs text-muted-foreground">/menus/{menu.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                        {categoryLabels[menu.category] ?? menu.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatVND(menu.price_per_person)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {menu.view_count ?? 0} views · {menu.lead_count ?? 0} leads
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(menu, "is_active")}
                        className={`p-1.5 rounded-lg transition-colors ${menu.is_active ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-muted-foreground bg-muted/30 hover:bg-muted/50"}`}>
                        {menu.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(menu, "is_featured")}
                        className={`p-1.5 rounded-lg transition-colors ${menu.is_featured ? "text-secondary bg-secondary/10 hover:bg-secondary/20" : "text-muted-foreground bg-muted/30 hover:bg-muted/50"}`}>
                        <Star className="w-4 h-4" fill={menu.is_featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/menus/${menu.id}/edit`}>
                          <span className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer block">
                            <Pencil className="w-4 h-4" />
                          </span>
                        </Link>
                        <button onClick={() => handleDelete(menu.id, menu.name)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {menus.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Chưa có menu nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
