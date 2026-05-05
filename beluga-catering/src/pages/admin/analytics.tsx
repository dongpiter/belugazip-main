import AdminLayout from "@/components/AdminLayout";
import { useGetAnalyticsSummary, useGetRevenueChart, useGetLeadsBySource, useGetTopMenus, useGetWeeklyInsight, useRefreshWeeklyInsight } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, FunnelChart, Funnel, Cell } from "recharts";
import { formatVND } from "@/lib/utils";
import { Loader2, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Summary = { orders_today: number; revenue_month: number; pending_orders: number; total_customers: number };
type RevenuePoint = { date: string; revenue: string | number; orders: string | number };
type LeadSource = { source: string; total: string | number; hot: string | number; warm: string | number };
type Menu = { id: string; name: string; view_count?: number | null; lead_count?: number | null; price_per_person: number };
type Insight = { insights: string[]; recommendations: string[]; generated_at: string; period: string };

const COLORS = ["#C8392B", "#F5A623", "#3b82f6", "#10b981", "#8b5cf6"];

export default function AdminAnalytics() {
  const { data: summary } = useGetAnalyticsSummary();
  const { data: revenueData } = useGetRevenueChart();
  const { data: leadsData } = useGetLeadsBySource();
  const { data: topMenus } = useGetTopMenus();
  const { data: insightData } = useGetWeeklyInsight();
  const refreshInsight = useRefreshWeeklyInsight();

  const s = summary as Summary | undefined;
  const revenue = (revenueData as RevenuePoint[] | undefined) ?? [];
  const leads = (leadsData as LeadSource[] | undefined) ?? [];
  const menus = (topMenus as Menu[] | undefined) ?? [];
  const insight = insightData as Insight | undefined;

  const handleAnalyze = async () => {
    try {
      await refreshInsight.mutateAsync();
      toast.success("AI đã phân tích xong! Xem kết quả bên dưới.");
    } catch {
      toast.error("Lỗi phân tích. Kiểm tra ANTHROPIC_API_KEY.");
    }
  };

  const funnelData = [
    { name: "Views", value: menus.reduce((sum, m) => sum + (m.view_count ?? 0), 0) },
    { name: "Leads", value: menus.reduce((sum, m) => sum + (m.lead_count ?? 0), 0) },
    { name: "Orders", value: s?.orders_today ? s.orders_today * 30 : 0 },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Phân tích hiệu quả kinh doanh</p>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">AI Insight {insight ? `— ${insight.period}` : ""}</h3>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={refreshInsight.isPending}
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {refreshInsight.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Phân tích ngay
          </button>
        </div>
        {insight ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Phân tích tuần</p>
              <ul className="space-y-1">
                {insight.insights.map((ins, i) => (
                  <li key={i} className="text-sm flex items-start gap-2"><span className="text-primary">•</span>{ins}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Đề xuất</p>
              <ul className="space-y-1">
                {insight.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm flex items-start gap-2"><span className="text-secondary">→</span>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nhấn "Phân tích ngay" để nhận phân tích AI từ dữ liệu thực tế.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Doanh thu 30 ngày</h3>
          {revenue.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenue.map((r) => ({ ...r, revenue: Number(r.revenue) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <Tooltip formatter={(v) => formatVND(Number(v))} />
                <Bar dataKey="revenue" fill="#C8392B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Leads theo nguồn</h3>
          {leads.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leads.map((l) => ({ ...l, total: Number(l.total), hot: Number(l.hot), warm: Number(l.warm) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="hot" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} name="Hot" />
                <Bar dataKey="warm" fill="#f59e0b" stackId="a" name="Warm" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Menus */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground">Top menus theo hiệu quả</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Menu</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Giá</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Leads</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">CVR</th>
              </tr>
            </thead>
            <tbody>
              {menus.slice(0, 8).map((menu, i) => {
                const cvr = menu.view_count ? ((menu.lead_count ?? 0) / menu.view_count * 100).toFixed(1) : "0";
                return (
                  <tr key={menu.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-bold text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{menu.name}</td>
                    <td className="px-4 py-3 text-primary font-semibold">{formatVND(menu.price_per_person)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{menu.view_count ?? 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">{menu.lead_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">{cvr}%</span>
                    </td>
                  </tr>
                );
              })}
              {menus.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
