import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAdminLogin } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [, navigate] = useLocation();
  const login = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ data: { password } });
      toast.success("Đăng nhập thành công");
      navigate("/admin");
    } catch {
      toast.error("Mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-foreground to-primary/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-4xl font-black tracking-wider text-primary mb-2">BELUGA</div>
          <p className="text-white/60 text-sm">Admin Dashboard</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-foreground mb-6">Đăng nhập quản trị</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu admin"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!password || login.isPending}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {login.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Đang đăng nhập...</> : "Đăng nhập"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
