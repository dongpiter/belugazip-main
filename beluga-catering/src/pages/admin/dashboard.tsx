import { motion } from "framer-motion";
import { ShoppingCart, DollarSign, Clock, Users, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AdminLayout from "@/components/AdminLayout";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import { useGetAnalyticsSummary, useGetRevenueChart, useGetLeadsBySource, useListOrders, useGetWeeklyInsight, useRefreshWeeklyInsight } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";

type Order = { id: string; customer_name: string; menu_name?: string | null; guest_count?: number | null; total_amount?: number | null; status?: string | null; ai_score?: string | null; created_at?: string | null };
type RevenuePoint = { date: string; revenue: string | number; orders: string | number };
type LeadSource = { source: string; total: string | number; hot: string | number; warm: string | number };
type Summary = { orders_today: number; revenue_month: number; pending_orders: number; total_customers: number };
type Insight = { insights: string[]; recommendations: string[]; generated_at: string; period: string };

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivering: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  delivering: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetAnalyticsSummary();
  const { data: revenueData } = useGetRevenueChart();
  const { data: leadsData } = useGetLeadsBySource();
  const { data: ordersData } = useListOrders({ status: undefined } as Parameters<typeof useListOrders>[0]);
  const { data: insightData } = useGetWeeklyInsight();
  const refreshInsight = useRefreshWeeklyInsight();

  const handleRefreshInsight = async () => {
    try {
      await refreshInsight.mutateAsync();
      toast.success("AI Insight đã được làm mới!");
    } catch {
      toast.error("Lỗi khi làm mới insight. Kiểm tra ANTHROPIC_API_KEY.");
    }
  };

  const s = summary as Summary | undefined;
  const revenue = (revenueData as RevenuePoint[] | undefined) ?? [];
  const leads = (leadsData as LeadSource[] | undefined) ?? [];
  const orders = ((ordersData as Order[] | undefined) ?? []).slice(0, 8);
  const insight = insightData as Insight | undefined;

  const statCards = [
    { icon: ShoppingCart, label: "Đơn hôm nay", value: s?.orders_today ?? 0, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: DollarSign, label: "Doanh thu tháng", value: formatVND(s?.revenue_month ?? 0), color: "text-green-600", bg: "bg-green-50" },
    { icon: Clock, label: "Chờ xác nhận", value: s?.pending_orders ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Users, label: "Tổng khách hàng", value: s?.total_customers ?? 0, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  if (loadingSummary) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Tổng quan hoạt động kinh doanh BELUGA Catering</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-border p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Doanh thu 30 ngày qua</h3>
          {revenue.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={leads.map((l) => ({ ...l, total: Number(l.total), hot: Number(l.hot) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#C8392B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hot" stroke="#F5A623" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI Weekly Insight */}
      {insight && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">AI Weekly Insight — {insight.period ?? "Tuần này"}</h3>
              {insight.generated_at && (
                <span className="text-xs text-muted-foreground">
                  · Cập nhật {new Date(insight.generated_at).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
            <button
              onClick={handleRefreshInsight}
              disabled={refreshInsight.isPending}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-colors border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              {refreshInsight.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Làm mới
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Phân tích</p>
              <ul className="space-y-1">
                {(insight.insights ?? []).map((ins, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>{ins}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Đề xuất</p>
              <ul className="space-y-1">
                {(insight.recommendations ?? []).map((rec, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-secondary mt-0.5">→</span>{rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">Đơn hàng gần đây</h3>
          <a href="/admin/orders" className="text-sm text-primary font-semibold hover:underline">Xem tất cả</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Khách hàng</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Menu</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Khách</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tổng tiền</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Trạng thái</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lead Score</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{order.customer_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.menu_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.guest_count ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatVND(order.total_amount ?? 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[order.status ?? ""] ?? "bg-muted text-muted-foreground"}`}>
                      {statusLabels[order.status ?? ""] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LeadScoreBadge score={order.ai_score} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chưa có đơn hàng</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
