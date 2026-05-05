import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import TipTapEditor from "@/components/admin/TipTapEditor";
import { useListAdminMenus, useCreateMenu, useUpdateMenu } from "@workspace/api-client-react";
import { Plus, Trash2, Loader2, ChevronLeft, Users, Tag, Star, Eye, GripVertical, Search } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { formatVND } from "@/lib/utils";

type Dish = { name: string; description: string };
type FAQ = { q: string; a: string };
type MenuRow = {
  id: string; name: string; slug: string; description?: string | null;
  long_description?: string | null; price_per_person: number;
  image_url?: string | null; banner_url?: string | null; category: string;
  is_active?: boolean | null; is_featured?: boolean | null; tag?: string | null;
  target_audience?: string | null; min_guests?: number | null; dishes?: Dish[] | null;
  nutrition_calories?: number | null; nutrition_protein?: number | null;
  nutrition_fat?: number | null; nutrition_carbs?: number | null;
  faqs?: FAQ[] | null; seo_metadata?: { meta_title?: string; meta_description?: string } | null
};

const categoryOptions = [
  { value: "office", label: "Văn phòng" },
  { value: "event", label: "Sự kiện" },
  { value: "vegan", label: "Chay" },
  { value: "teabreak", label: "Teabreak" },
  { value: "buffet", label: "Buffet" },
];

const categoryLabels: Record<string, string> = {
  office: "Văn phòng", event: "Sự kiện", vegan: "Chay", teabreak: "Teabreak", buffet: "Buffet",
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function MenuForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  const [, navigate] = useLocation();

  const { data: allMenus } = useListAdminMenus();
  const existingMenu = isEdit ? (allMenus as MenuRow[] | undefined)?.find((m) => m.id === id) : undefined;

  const [form, setForm] = useState({
    name: "", slug: "", description: "", long_description: "", tag: "", target_audience: "",
    price_per_person: 95000, image_url: "", banner_url: "", category: "office",
    is_active: true, is_featured: false, min_guests: 10,
    nutrition_calories: 400, nutrition_protein: 30, nutrition_fat: 12, nutrition_carbs: 45,
    meta_title: "", meta_description: "",
  });
  const [dishes, setDishes] = useState<Dish[]>([{ name: "", description: "" }]);
  const [faqs, setFaqs] = useState<FAQ[]>([{ q: "", a: "" }]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (existingMenu) {
      setForm({
        name: existingMenu.name ?? "",
        slug: existingMenu.slug ?? "",
        description: existingMenu.description ?? "",
        long_description: existingMenu.long_description ?? "",
        tag: existingMenu.tag ?? "",
        target_audience: existingMenu.target_audience ?? "",
        price_per_person: existingMenu.price_per_person ?? 95000,
        image_url: existingMenu.image_url ?? "",
        banner_url: existingMenu.banner_url ?? "",
        category: existingMenu.category ?? "office",
        is_active: existingMenu.is_active ?? true,
        is_featured: existingMenu.is_featured ?? false,
        min_guests: existingMenu.min_guests ?? 10,
        nutrition_calories: existingMenu.nutrition_calories ?? 400,
        nutrition_protein: existingMenu.nutrition_protein ?? 30,
        nutrition_fat: existingMenu.nutrition_fat ?? 12,
        nutrition_carbs: existingMenu.nutrition_carbs ?? 45,
        meta_title: (existingMenu.seo_metadata as { meta_title?: string } | null)?.meta_title ?? "",
        meta_description: (existingMenu.seo_metadata as { meta_description?: string } | null)?.meta_description ?? "",
      });
      if (existingMenu.dishes?.length) setDishes(existingMenu.dishes as Dish[]);
      if (existingMenu.faqs?.length) setFaqs(existingMenu.faqs as FAQ[]);
    }
  }, [existingMenu]);

  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      dishes: dishes.filter((d) => d.name),
      faqs: faqs.filter((f) => f.q),
      seo_metadata: { meta_title: form.meta_title, meta_description: form.meta_description },
    };
    try {
      if (isEdit) {
        await updateMenu.mutateAsync({ id: id!, data: payload as Parameters<typeof updateMenu.mutateAsync>[0]["data"] });
        toast.success("Đã cập nhật menu");
      } else {
        await createMenu.mutateAsync({ data: payload as Parameters<typeof createMenu.mutateAsync>[0]["data"] });
        toast.success("Đã tạo menu mới");
      }
      navigate("/admin/menus");
    } catch {
      toast.error("Lỗi lưu menu");
    }
  };

  const isPending = createMenu.isPending || updateMenu.isPending;

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/menus">
          <span className="p-2 bg-card border border-border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground">{isEdit ? "Chỉnh sửa menu" : "Tạo menu mới"}</h1>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left: Form (60%) */}
        <form onSubmit={handleSubmit} className="flex-[3] space-y-5 min-w-0">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Tên menu *</label>
                <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Danh mục</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                  {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Giá/người (đ) *</label>
                <input type="number" value={form.price_per_person}
                  onChange={(e) => setForm((f) => ({ ...f, price_per_person: Number(e.target.value) }))} required
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Số lượng tối thiểu</label>
                <input type="number" value={form.min_guests}
                  onChange={(e) => setForm((f) => ({ ...f, min_guests: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tag</label>
                <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  placeholder="Eat Clean, Cao cấp..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Đối tượng</label>
                <input value={form.target_audience}
                  onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Mô tả ngắn</label>
                <textarea value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Mô tả chi tiết</label>
                <TipTapEditor
                  content={form.long_description}
                  onChange={(html) => setForm((f) => ({ ...f, long_description: html }))}
                  placeholder="Mô tả chi tiết về menu..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">URL ảnh thumbnail</label>
                <input value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">URL banner</label>
                <input value={form.banner_url}
                  onChange={(e) => setForm((f) => ({ ...f, banner_url: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-primary" />
                  <span className="text-sm font-medium">Hiển thị</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-primary" />
                  <span className="text-sm font-medium">Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dishes */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Món ăn trong menu</h3>
              <button type="button" onClick={() => setDishes([...dishes, { name: "", description: "" }])}
                className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                <Plus className="w-3.5 h-3.5" />Thêm món
              </button>
            </div>
            {dishes.map((dish, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => { e.preventDefault(); setDragOverIdx(i); }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
                  const next = [...dishes];
                  const [moved] = next.splice(dragIdx, 1);
                  next.splice(i, 0, moved);
                  setDishes(next);
                  setDragIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                className={`flex gap-3 items-start rounded-lg transition-all ${dragOverIdx === i && dragIdx !== i ? "ring-2 ring-primary/50 bg-primary/5" : ""} ${dragIdx === i ? "opacity-50" : ""}`}
              >
                <div className="flex items-center mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input value={dish.name} onChange={(e) => { const d = [...dishes]; d[i].name = e.target.value; setDishes(d); }} placeholder="Tên món"
                    className="px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  <input value={dish.description} onChange={(e) => { const d = [...dishes]; d[i].description = e.target.value; setDishes(d); }} placeholder="Mô tả"
                    className="px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
                <button type="button" onClick={() => setDishes(dishes.filter((_, j) => j !== i))} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Nutrition */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Dinh dưỡng (mỗi suất)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[["nutrition_calories", "Calories (kcal)"], ["nutrition_protein", "Protein (g)"], ["nutrition_fat", "Chất béo (g)"], ["nutrition_carbs", "Carbs (g)"]].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">{label}</label>
                  <input type="number" value={form[key as keyof typeof form] as number}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">FAQs</h3>
              <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                <Plus className="w-3.5 h-3.5" />Thêm FAQ
              </button>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input value={faq.q} onChange={(e) => { const f = [...faqs]; f[i].q = e.target.value; setFaqs(f); }} placeholder="Câu hỏi"
                    className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  <textarea value={faq.a} onChange={(e) => { const f = [...faqs]; f[i].a = e.target.value; setFaqs(f); }} placeholder="Câu trả lời" rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
                </div>
                <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">SEO</h3>
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
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={isPending}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Đang lưu...</> : (isEdit ? "Cập nhật menu" : "Tạo menu")}
            </button>
            <Link href="/admin/menus">
              <span className="px-8 py-3 rounded-xl font-bold border border-border text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer block">Hủy</span>
            </Link>
          </div>
        </form>

        {/* Right: Live Preview Card (40%) */}
        <div className="flex-[2] sticky top-6 space-y-4 min-w-0">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Xem trước thẻ menu</span>
            </div>

            {/* Preview Card */}
            <div className="p-4">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="relative h-40 bg-muted">
                  {form.image_url ? (
                    <img src={form.image_url} alt={form.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      Chưa có ảnh
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {form.tag && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />{form.tag}
                      </span>
                    )}
                    {form.is_featured && (
                      <span className="bg-secondary text-foreground text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" />Nổi bật
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {categoryLabels[form.category] ?? form.category}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-foreground text-base line-clamp-1">
                    {form.name || "Tên menu..."}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
                    {form.description || "Mô tả ngắn..."}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-lg font-black text-primary">{formatVND(form.price_per_person)}</p>
                      <p className="text-xs text-muted-foreground">/ người</p>
                    </div>
                    <div className="text-right">
                      {form.min_guests > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />Min {form.min_guests} người
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dishes preview */}
          {dishes.some((d) => d.name) && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
              <h4 className="text-sm font-bold text-foreground mb-3">Món ăn ({dishes.filter((d) => d.name).length})</h4>
              <ul className="space-y-1">
                {dishes.filter((d) => d.name).map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>
                      <span className="font-medium text-foreground">{d.name}</span>
                      {d.description && <span className="text-muted-foreground"> — {d.description}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition preview */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
            <h4 className="text-sm font-bold text-foreground mb-3">Dinh dưỡng / suất</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Calories", value: form.nutrition_calories, unit: "kcal", color: "text-orange-500" },
                { label: "Protein", value: form.nutrition_protein, unit: "g", color: "text-blue-500" },
                { label: "Chất béo", value: form.nutrition_fat, unit: "g", color: "text-yellow-500" },
                { label: "Carbs", value: form.nutrition_carbs, unit: "g", color: "text-green-500" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="bg-muted/30 rounded-lg p-2 text-center">
                  <p className={`text-base font-black ${color}`}>{value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span></p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility badge */}
          <div className={`rounded-xl border px-4 py-3 text-sm font-semibold text-center ${form.is_active ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {form.is_active ? "Đang hiển thị trên website" : "Đang ẩn khỏi website"}
          </div>

          {/* Google SERP Preview */}
          {(form.meta_title || form.name) && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Xem trước Google Search</span>
              </div>
              <div className="bg-white border border-border rounded-xl p-4 font-sans">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">B</span>
                  </div>
                  belugacatering.vn › menus › <span className="font-medium">{form.slug || "ten-menu"}</span>
                </div>
                <p className="text-[#1a0dab] text-lg font-medium leading-tight hover:underline cursor-pointer line-clamp-1">
                  {form.meta_title || (form.name + " — BELUGA Catering TPHCM")}
                </p>
                <div className="flex items-center gap-1 mt-0.5 mb-1">
                  <span className="text-xs text-green-700">belugacatering.vn</span>
                  <span className="text-xs text-muted-foreground">›</span>
                  <span className="text-xs text-green-700">menus</span>
                </div>
                <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                  {form.meta_description || form.description || "Mô tả ngắn về menu sẽ xuất hiện ở đây trong kết quả tìm kiếm Google."}
                </p>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                <span className={form.meta_title.length > 60 ? "text-red-500 font-semibold" : "text-green-600"}>
                  Title: {form.meta_title.length}/60 ký tự
                </span>
                <span className={form.meta_description.length > 160 ? "text-red-500 font-semibold" : "text-green-600"}>
                  Desc: {form.meta_description.length}/160 ký tự
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
