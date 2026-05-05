import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrder, useListMenus } from "@workspace/api-client-react";
import { toast } from "sonner";
import { formatVND } from "@/lib/utils";

const schema = z.object({
  customer_name: z.string().min(2, "Vui lòng nhập tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  service_type: z.string().min(1, "Vui lòng chọn dịch vụ"),
  guest_count: z.coerce.number().min(1).optional(),
});
type FormData = z.infer<typeof schema>;

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);
  const { data: menus } = useListMenus();
  const createOrder = useCreateOrder();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("exit_popup_dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered.current) {
        triggered.current = true;
        setTimeout(() => setOpen(true), 300);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem("exit_popup_dismissed", "1");
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service_type: "Cơm văn phòng" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createOrder.mutateAsync({
        data: {
          ...data,
          address: "Sẽ xác nhận sau",
          event_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          source_page: window.location.pathname,
          utm_source: "exit_intent",
          menu_name: "",
          price_per_person: 0,
        } as Parameters<typeof createOrder.mutateAsync>[0]["data"],
      });
      setSubmitted(true);
      toast.success("Cảm ơn! BELUGA sẽ liên hệ trong 30 phút.");
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng gọi 0909 123 456");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-primary to-primary/80 px-8 py-7 text-center">
              <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="text-4xl mb-2">🍽️</div>
              <h2 className="text-2xl font-black text-white mb-1">Chưa tìm được menu ưng ý?</h2>
              <p className="text-white/80 text-sm">Để lại thông tin — BELUGA tư vấn miễn phí trong 30 phút!</p>
            </div>

            <div className="px-8 py-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Nhận thông tin rồi!</h3>
                  <p className="text-muted-foreground text-sm mb-4">Đội tư vấn BELUGA sẽ gọi cho bạn trong vòng 30 phút.</p>
                  <button onClick={dismiss} className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm">
                    Tiếp tục xem trang
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input {...register("customer_name")} placeholder="Họ và tên *"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                      {errors.customer_name && <p className="text-destructive text-xs mt-1">{errors.customer_name.message}</p>}
                    </div>
                    <div>
                      <input {...register("phone")} placeholder="Số điện thoại *"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select {...register("service_type")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none">
                        <option>Cơm văn phòng</option>
                        <option>Tiệc sự kiện</option>
                        <option>Buffet</option>
                        <option>Teabreak</option>
                        <option>Suất ăn công nghiệp</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <input {...register("guest_count")} type="number" placeholder="Số khách (dự kiến)"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  </div>
                  <button type="submit" disabled={createOrder.isPending}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                    {createOrder.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Đang gửi...</> : "Nhận tư vấn miễn phí ngay"}
                  </button>
                  <button type="button" onClick={dismiss} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                    Không cảm ơn, tôi sẽ tự tìm
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
