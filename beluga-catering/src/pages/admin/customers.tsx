import AdminLayout from "@/components/AdminLayout";
import { useListCustomers } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { Loader2, Award } from "lucide-react";

type Customer = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  total_orders?: number | null;
  total_spent?: number | null;
  loyalty_points?: number | null;
  referral_code?: string | null;
  created_at?: string | null;
};

export default function AdminCustomers() {
  const { data, isLoading } = useListCustomers();
  const customers = (data as Customer[] | undefined) ?? [];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Khách hàng</h1>
        <p className="text-muted-foreground text-sm mt-1">Danh sách khách hàng và điểm tích lũy</p>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Liên hệ</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Đơn hàng</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tổng chi tiêu</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Điểm tích lũy</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Mã giới thiệu</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{c.name ?? "—"}</div>
                      {(c.total_spent ?? 0) > 10000000 && (
                        <span className="inline-flex items-center gap-1 text-xs text-secondary font-bold">
                          <Award className="w-3 h-3" />VIP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{c.phone ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{c.email ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{c.total_orders ?? 0}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{formatVND(c.total_spent ?? 0)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary font-bold text-xs px-2.5 py-1 rounded-full">
                        <Award className="w-3 h-3" />{(c.loyalty_points ?? 0).toLocaleString("vi-VN")} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs bg-muted/20 text-foreground">{c.referral_code ?? "—"}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Chưa có khách hàng</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
