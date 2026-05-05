import { useEffect, useRef, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, Users, BookOpen, BarChart2, Settings,
  LogOut, Kanban, Star, Loader2
} from "lucide-react";
import { useAdminCheck, useAdminLogout, useLatestOrderId } from "@workspace/api-client-react";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/realtime-orders", icon: Kanban, label: "Kanban Orders" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
  { href: "/admin/leads", icon: Star, label: "Leads" },
  { href: "/admin/customers", icon: Users, label: "Khách hàng" },
  { href: "/admin/menus", icon: BookOpen, label: "Thực đơn" },
  { href: "/admin/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { data: authData, isLoading, isError } = useAdminCheck({ query: { retry: false } });
  const logout = useAdminLogout();
  const { data: latestOrder } = useLatestOrderId();
  const lastOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoading && (isError || !(authData as { authenticated?: boolean } | undefined)?.authenticated)) {
      navigate("/admin/login");
    }
  }, [authData, isLoading, isError, navigate]);

  useEffect(() => {
    if (!latestOrder) return;
    const order = latestOrder as { id: string; customer_name: string; menu_name?: string; total_amount?: number };
    if (lastOrderIdRef.current === null) {
      lastOrderIdRef.current = order.id;
      return;
    }
    if (order.id !== lastOrderIdRef.current) {
      lastOrderIdRef.current = order.id;
      const amount = order.total_amount ? ` — ${Number(order.total_amount).toLocaleString("vi-VN")}đ` : "";
      toast.info(`🔔 Đơn mới: ${order.customer_name}${order.menu_name ? ` · ${order.menu_name}` : ""}${amount}`, {
        duration: 8000,
        action: { label: "Xem", onClick: () => navigate("/admin/orders") },
      });
    }
  }, [latestOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !(authData as { authenticated?: boolean } | undefined)?.authenticated) return null;

  const handleLogout = async () => {
    await logout.mutateAsync();
    toast.success("Đã đăng xuất");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-border">
          <Link href="/admin">
            <span className="text-2xl font-black tracking-wider text-primary cursor-pointer">BELUGA</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 min-h-screen">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
