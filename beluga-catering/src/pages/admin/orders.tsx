import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Loader2, ChevronDown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import { useListOrders, useUpdateOrderStatus, useGenerateQuoteEmail } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  menu_name?: string | null;
  guest_count?: number | null;
  event_date?: string | null;
  address?: string | null;
  subtotal?: number | null;
  service_fee?: number | null;
  total_amount?: number | null;
  status?: string | null;
  ai_score?: string | null;
  ai_score_reason?: string | null;
  utm_source?: string | null;
  created_at?: string | null;
};

const statusOptions = ["", "pending", "confirmed", "preparing", "delivering", "completed", "cancelled"];
const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận", preparing: "Đang chuẩn bị",
  delivering: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy",
};
const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700", delivering: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [emailContent, setEmailContent] = useState("");

  const { data, isLoading, refetch } = useListOrders({ status: statusFilter || undefined } as Parameters<typeof useListOrders>[0]);
  const orders = (data as Order[] | undefined) ?? [];
  const updateStatus = useUpdateOrderStatus();
  const generateEmail = useGenerateQuoteEmail();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, data: { status: newStatus } });
      toast.success("Cập nhật trạng thái thành công");
      refetch();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleGenerateEmail = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const result = await generateEmail.mutateAsync({ data: { order_id: order.id } });
      setEmailContent((result as unknown as { email: string }).email ?? (result as { body?: string }).body ?? "");
    } catch {
      toast.error("Không thể tạo email báo giá");
    }
  };

  const exportCSV = () => {
    const headers = ["Khách hàng", "SĐT", "Email", "Menu", "Số khách", "Ngày", "Tổng tiền", "Trạng thái", "AI Score"];
    const rows = orders.map((o) => [
      o.customer_name, o.phone, o.email ?? "", o.menu_name ?? "", o.guest_count ?? "", o.event_date ?? "",
      o.total_amount ?? 0, o.status ?? "", o.ai_score ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Đơn hàng</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý tất cả đơn đặt catering</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted/30 transition-colors">
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${statusFilter === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:border-primary/30"}`}>
            {s === "" ? "Tất cả" : statusLabels[s]}
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Khách hàng</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Menu / Khách</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tổng tiền</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Trạng thái</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nguồn</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{order.menu_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{order.guest_count ?? "—"} khách · {order.event_date ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{formatVND(order.total_amount ?? 0)}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status ?? "pending"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full appearance-none pr-6 cursor-pointer ${statusColors[order.status ?? ""] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><LeadScoreBadge score={order.ai_score} /></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{order.utm_source ?? "organic"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleGenerateEmail(order)}
                        disabled={generateEmail.isPending && selectedOrder?.id === order.id}
                        className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold disabled:opacity-50">
                        {generateEmail.isPending && selectedOrder?.id === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                        Email báo giá
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Không có đơn hàng</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEmailContent("")}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-foreground text-lg mb-4">Email Báo Giá — {selectedOrder?.customer_name}</h3>
            <pre className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-xl p-4 font-sans">{emailContent}</pre>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { navigator.clipboard.writeText(emailContent); toast.success("Đã copy email"); }}
                className="flex-1 bg-primary text-white py-2 rounded-xl font-semibold text-sm hover:bg-primary/90">
                Copy email
              </button>
              <button onClick={() => setEmailContent("")}
                className="flex-1 bg-muted text-foreground py-2 rounded-xl font-semibold text-sm hover:bg-muted/70">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
