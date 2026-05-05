import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE = "/api";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { password: string } }) =>
      apiFetch("/admin/login", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-check"] }),
  });
}

export function useAdminLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch("/admin/logout", { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-check"] }),
  });
}

export function useAdminCheck() {
  return useQuery({
    queryKey: ["admin-check"],
    queryFn: () => apiFetch("/admin/check"),
    retry: false,
    staleTime: 60_000,
  });
}

// ─── MENUS ───────────────────────────────────────────────────────────────────

export function useListMenus(params?: { category?: string; featured?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured) qs.set("featured", "true");
  const search = qs.toString() ? "?" + qs.toString() : "";
  return useQuery({
    queryKey: ["menus", params],
    queryFn: () => apiFetch("/menus" + search),
    staleTime: 30_000,
  });
}

export function useGetMenuBySlug(slug: string) {
  return useQuery({
    queryKey: ["menu", slug],
    queryFn: () => apiFetch("/menus/" + slug),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useListAdminMenus() {
  return useQuery({
    queryKey: ["admin-menus"],
    queryFn: () => apiFetch("/admin/menus"),
    staleTime: 10_000,
  });
}

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) =>
      apiFetch("/admin/menus", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menus"] });
      qc.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useUpdateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiFetch("/admin/menus/" + id, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menus"] });
      qc.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiFetch("/admin/menus/" + id, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menus"] });
      qc.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

// ─── BLOG ────────────────────────────────────────────────────────────────────

export function useListBlogPosts(params?: { category?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const search = qs.toString() ? "?" + qs.toString() : "";
  return useQuery({
    queryKey: ["blog-posts", params],
    queryFn: () => apiFetch("/blog" + search),
    staleTime: 30_000,
  });
}

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => apiFetch("/blog/" + slug),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useListAdminBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: () => apiFetch("/admin/blog"),
    staleTime: 10_000,
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) =>
      apiFetch("/admin/blog", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiFetch("/admin/blog/" + id, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiFetch("/admin/blog/" + id, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export function useListOrders(params?: { status?: string; score?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.score) qs.set("score", params.score);
  const search = qs.toString() ? "?" + qs.toString() : "";
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => apiFetch("/orders" + search),
    staleTime: 15_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) =>
      apiFetch("/orders", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string } }) =>
      apiFetch("/orders/" + id + "/status", { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// ─── LEADS ───────────────────────────────────────────────────────────────────

export function useListLeads(params?: { score?: string }) {
  const qs = new URLSearchParams();
  if (params?.score) qs.set("score", params.score);
  const search = qs.toString() ? "?" + qs.toString() : "";
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => apiFetch("/leads" + search),
    staleTime: 15_000,
  });
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

export function useListCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => apiFetch("/customers"),
    staleTime: 30_000,
  });
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export function useGetAnalyticsSummary() {
  return useQuery({
    queryKey: ["analytics-summary"],
    queryFn: () => apiFetch("/analytics/summary"),
    staleTime: 60_000,
  });
}

export function useGetRevenueChart() {
  return useQuery({
    queryKey: ["analytics-revenue"],
    queryFn: () => apiFetch("/analytics/revenue"),
    staleTime: 60_000,
  });
}

export function useGetLeadsBySource() {
  return useQuery({
    queryKey: ["analytics-leads-by-source"],
    queryFn: () => apiFetch("/analytics/leads-by-source"),
    staleTime: 60_000,
  });
}

export function useGetTopMenus() {
  return useQuery({
    queryKey: ["analytics-top-menus"],
    queryFn: () => apiFetch("/analytics/top-menus"),
    staleTime: 60_000,
  });
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export function useGetAllSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch("/settings"),
    staleTime: 60_000,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: { value: unknown } }) =>
      apiFetch("/admin/settings/" + key, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

// ─── A/B TESTING ─────────────────────────────────────────────────────────────

export function useTrackAbImpression() {
  return useMutation({
    mutationFn: ({ data }: { data: { test_id: string; variant: string } }) =>
      apiFetch("/ab/impression", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useTrackAbClick() {
  return useMutation({
    mutationFn: ({ data }: { data: { test_id: string; variant: string } }) =>
      apiFetch("/ab/click", { method: "POST", body: JSON.stringify(data) }),
  });
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export function useRecommendMenu() {
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) =>
      apiFetch("/ai/recommend-menu", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({ data }: { data: { message: string; session_id?: string; history?: Array<{ role: string; content: string }> } }) =>
      apiFetch("/ai/chat", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useGenerateBlog() {
  return useMutation({
    mutationFn: ({ data }: { data: { topic: string; keywords?: string[]; category?: string } }) =>
      apiFetch("/ai/generate-blog", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useGenerateQuoteEmail() {
  return useMutation({
    mutationFn: ({ data }: { data: { order_id: string } }) =>
      apiFetch("/ai/generate-quote-email", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useGetWeeklyInsight() {
  return useQuery({
    queryKey: ["weekly-insight"],
    queryFn: () => apiFetch("/ai/weekly-insight"),
    staleTime: 300_000,
  });
}

export function useRefreshWeeklyInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch("/ai/weekly-insight", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weekly-insight"] }),
  });
}

export function useLatestOrderId() {
  return useQuery({
    queryKey: ["latest-order-id"],
    queryFn: async () => {
      const orders = await apiFetch("/orders?limit=1") as Array<{ id: string; customer_name: string; menu_name?: string; total_amount?: number }>;
      return orders?.[0] ?? null;
    },
    refetchInterval: 30_000,
    staleTime: 0,
  });
}
