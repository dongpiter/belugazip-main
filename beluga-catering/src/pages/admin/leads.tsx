import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import { useListLeads, useGetLeadsBySource } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Download } from "lucide-react";

type Lead = {
  id: string;
  customer_name?: string | null;
  phone?: string | null;
  email?: string | null;
  menu_name?: string | null;
  menu_price?: number | null;
  guest_count?: number | null;
  service_type?: string | null;
  source_page?: string | null;
  utm_source?: string | null;
  ai_score?: string | null;
  ai_score_reason?: string | null;
  created_at?: string | null;
};

type LeadSource = { source: string; total: string | number; hot: string | number; warm: string | number; cold: string | number };

const scoreOptions = ["", "hot", "warm", "cold"];

export default function AdminLeads() {
  const [scoreFilter, setScoreFilter] = useState("");
  const { data, isLoading } = useListLeads({ score: scoreFilter || undefined } as Parameters<typeof useListLeads>[0]);
  const { data: sourceData } = useGetLeadsBySource();

  const leads = (data as Lead[] | undefined) ?? [];
  const sources = (sourceData as LeadSource[] | undefined) ?? [];

  const exportCSV = () => {
    const headers = ["Khách hàng", "SĐT", "Email", "Menu", "Số khách", "Dịch vụ", "Score", "Lý do", "Nguồn", "Trang", "Ngày tạo"];
    const rows = leads.map((l) => [
      l.customer_name ?? "", l.phone ?? "", l.email ?? "",
      l.menu_name ?? "", l.guest_count ?? "", l.service_type ?? "",
      l.ai_score ?? "", `"${(l.ai_score_reason ?? "").replace(/"/g, "'")}"`,
      l.utm_source ?? "organic", l.source_page ?? "",
      l.created_at ? new Date(l.created_at).toLocaleDateString("vi-VN") : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý và phân tích leads từ tất cả kênh</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted/30 transition-colors">
          <Download className="w-4 h-4" />Xuất CSV
        </button>
      </div>

      {/* Source Chart */}
      {sources.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-6">
          <h3 className="font-bold text-foreground mb-4">Leads theo nguồn</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sources.map((s) => ({ ...s, total: Number(s.total), hot: Number(s.hot), warm: Number(s.warm), cold: Number(s.cold) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="source" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="hot" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" name="Hot" />
              <Bar dataKey="warm" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" name="Warm" />
              <Bar dataKey="cold" fill="#3b82f6" radius={[0, 0, 4, 4]} stackId="a" name="Cold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {scoreOptions.map((s) => (
          <button key={s} onClick={() => setScoreFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${scoreFilter === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:border-primary/30"}`}>
            {s === "" ? "Tất cả" : s === "hot" ? "Hot" : s === "warm" ? "Warm" : "Cold"}
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Menu / Dịch vụ</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Số khách</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nguồn</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{lead.customer_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{lead.phone} {lead.email ? `· ${lead.email}` : ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{lead.menu_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{lead.service_type ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{lead.guest_count ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="mb-1"><LeadScoreBadge score={lead.ai_score} /></div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{lead.ai_score_reason}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{lead.utm_source ?? "organic"}<br />{lead.source_page}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString("vi-VN") : "—"}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Chưa có leads</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
