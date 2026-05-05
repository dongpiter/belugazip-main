import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useGetAllSettings, useUpdateSetting } from "@workspace/api-client-react";
import { ChevronDown, ChevronRight, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Settings = Record<string, unknown>;

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, description, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
      >
        <div className="text-left">
          <p className="font-bold text-foreground">{title}</p>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {open ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-border">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-foreground">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { data, isLoading, refetch } = useGetAllSettings();
  const updateSetting = useUpdateSetting();

  const settings = data as Settings | undefined;

  const [branding, setBranding] = useState({ site_name: "BELUGA Catering", logo_url: "" });
  const [company, setCompany] = useState({ name: "BELUGA Catering", address: "", phone: "", email: "" });
  const [social, setSocial] = useState({ facebook: "", zalo: "", instagram: "" });
  const [seo, setSeo] = useState({ meta_title: "", meta_description: "" });
  const [abTest, setAbTest] = useState({ active_variant: "A", variant_A: "Đặt tiệc ngay", variant_B: "Nhận báo giá miễn phí" });

  useEffect(() => {
    if (settings) {
      if (settings.branding) setBranding(settings.branding as typeof branding);
      if (settings.company_info) setCompany(settings.company_info as typeof company);
      if (settings.social_links) setSocial(settings.social_links as typeof social);
      if (settings.seo_defaults) setSeo(settings.seo_defaults as typeof seo);
      if (settings.ab_hero_cta) setAbTest(settings.ab_hero_cta as typeof abTest);
    }
  }, [settings]);

  const save = async (key: string, value: unknown) => {
    try {
      await updateSetting.mutateAsync({ key, data: { value } } as Parameters<typeof updateSetting.mutateAsync>[0]);
      toast.success("Đã lưu cài đặt");
      refetch();
    } catch {
      toast.error("Lỗi lưu cài đặt");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Cài đặt</h1>
        <p className="text-muted-foreground text-sm mt-1">Quản lý cấu hình website</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <Section title="Thương hiệu" description="Tên website, logo" defaultOpen>
          <div className="space-y-4 mt-2">
            <Field label="Tên website" value={branding.site_name} onChange={(v) => setBranding({ ...branding, site_name: v })} />
            <Field label="URL Logo" value={branding.logo_url} onChange={(v) => setBranding({ ...branding, logo_url: v })} />
            <button onClick={() => save("branding", branding)} disabled={updateSetting.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              <Save className="w-4 h-4" />Lưu thương hiệu
            </button>
          </div>
        </Section>

        <Section title="Thông tin công ty" description="Địa chỉ, SĐT, email">
          <div className="space-y-4 mt-2">
            <Field label="Tên công ty" value={company.name} onChange={(v) => setCompany({ ...company, name: v })} />
            <Field label="Địa chỉ" value={company.address} onChange={(v) => setCompany({ ...company, address: v })} />
            <Field label="Số điện thoại" value={company.phone} onChange={(v) => setCompany({ ...company, phone: v })} />
            <Field label="Email" value={company.email} onChange={(v) => setCompany({ ...company, email: v })} />
            <button onClick={() => save("company_info", company)} disabled={updateSetting.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              <Save className="w-4 h-4" />Lưu thông tin
            </button>
          </div>
        </Section>

        <Section title="Mạng xã hội" description="Facebook, Zalo, Instagram">
          <div className="space-y-4 mt-2">
            <Field label="Facebook URL" value={social.facebook} onChange={(v) => setSocial({ ...social, facebook: v })} />
            <Field label="Zalo" value={social.zalo} onChange={(v) => setSocial({ ...social, zalo: v })} />
            <Field label="Instagram URL" value={social.instagram} onChange={(v) => setSocial({ ...social, instagram: v })} />
            <button onClick={() => save("social_links", social)} disabled={updateSetting.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              <Save className="w-4 h-4" />Lưu social
            </button>
          </div>
        </Section>

        <Section title="SEO mặc định" description="Meta title và description cho trang chủ">
          <div className="space-y-4 mt-2">
            <Field label="Meta Title" value={seo.meta_title} onChange={(v) => setSeo({ ...seo, meta_title: v })} />
            <Field label="Meta Description" value={seo.meta_description} onChange={(v) => setSeo({ ...seo, meta_description: v })} multiline />
            <button onClick={() => save("seo_defaults", seo)} disabled={updateSetting.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              <Save className="w-4 h-4" />Lưu SEO
            </button>
          </div>
        </Section>

        <Section title="A/B Testing Hero CTA" description="Thử nghiệm nút CTA trang chủ">
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Variant đang chạy</label>
              <select value={abTest.active_variant} onChange={(e) => setAbTest({ ...abTest, active_variant: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
              </select>
            </div>
            <Field label="Text Variant A" value={abTest.variant_A} onChange={(v) => setAbTest({ ...abTest, variant_A: v })} />
            <Field label="Text Variant B" value={abTest.variant_B} onChange={(v) => setAbTest({ ...abTest, variant_B: v })} />
            <button onClick={() => save("ab_hero_cta", abTest)} disabled={updateSetting.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              <Save className="w-4 h-4" />Lưu A/B test
            </button>
          </div>
        </Section>
      </div>
    </AdminLayout>
  );
}
