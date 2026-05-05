import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import { useListOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  menu_name?: string | null;
  guest_count?: number | null;
  event_date?: string | null;
  total_amount?: number | null;
  status?: string | null;
  ai_score?: string | null;
  created_at?: string | null;
};

const columns = [
  { id: "pending", label: "Chờ xác nhận", color: "bg-amber-50 border-amber-200", headerColor: "bg-amber-100 text-amber-700" },
  { id: "confirmed", label: "Đã xác nhận", color: "bg-blue-50 border-blue-200", headerColor: "bg-blue-100 text-blue-700" },
  { id: "preparing", label: "Đang chuẩn bị", color: "bg-purple-50 border-purple-200", headerColor: "bg-purple-100 text-purple-700" },
  { id: "delivering", label: "Đang giao", color: "bg-indigo-50 border-indigo-200", headerColor: "bg-indigo-100 text-indigo-700" },
  { id: "completed", label: "Hoàn thành", color: "bg-green-50 border-green-200", headerColor: "bg-green-100 text-green-700" },
];

export default function RealtimeOrders() {
  const { data, isLoading, refetch } = useListOrders();
  const updateStatus = useUpdateOrderStatus();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const orders = (data as Order[] | undefined) ?? [];

  const getOrdersByStatus = (status: string) =>
    orders.filter((o) => o.status === status);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDragging(orderId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!dragging) return;
    const order = orders.find((o) => o.id === dragging);
    if (!order || order.status === status) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: dragging, data: { status } });
      toast.success(`Chuyển sang: ${columns.find((c) => c.id === status)?.label}`);
      refetch();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
    setDragging(null);
    setDragOver(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Kanban Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Kéo thả đơn hàng để cập nhật trạng thái</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {columns.map((col) => {
            const colOrders = getOrdersByStatus(col.id);
            return (
              <div
                key={col.id}
                className={`flex-shrink-0 w-72 rounded-2xl border-2 ${col.color} ${dragOver === col.id ? "ring-2 ring-primary" : ""} transition-all`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className={`px-4 py-3 rounded-t-xl ${col.headerColor} flex items-center justify-between`}>
                  <span className="font-bold text-sm">{col.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/60">{colOrders.length}</span>
                </div>
                <div className="p-3 space-y-3 min-h-[400px]">
                  {colOrders.map((order) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      className={`bg-white rounded-xl p-4 shadow-sm border border-white/80 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${dragging === order.id ? "opacity-50 scale-95" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-sm">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LeadScoreBadge score={order.ai_score} showLabel={false} />
                          <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{order.menu_name ?? "—"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{order.guest_count ?? "—"} khách · {order.event_date ?? "—"}</span>
                        <span className="text-sm font-black text-primary">{formatVND(order.total_amount ?? 0)}</span>
                      </div>
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-muted-foreground/50 text-xs border-2 border-dashed border-current rounded-xl">
                      Kéo đơn hàng vào đây
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
