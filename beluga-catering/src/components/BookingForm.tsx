import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Users, Calendar, MapPin, ChevronDown } from "lucide-react";
import { useCreateOrder, useListMenus } from "@workspace/api-client-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  customer_name: z.string().min(2, "Vui lòng nhập tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  service_type: z.string().min(1, "Vui lòng chọn dịch vụ"),
  menu_id: z.string().optional(),
  guest_count: z.coerce.number().min(1, "Vui lòng nhập số lượng khách"),
  event_date: z.string().min(1, "Vui lòng chọn ngày"),
  event_time: z.string().optional(),
  address: z.string().min(5, "Vui lòng nhập địa chỉ"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BookingFormProps {
  preselectedMenuId?: string;
  preselectedMenuName?: string;
  preselectedMenuPrice?: number;
}

export default function BookingForm({ preselectedMenuId, preselectedMenuName, preselectedMenuPrice }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(preselectedMenuPrice ?? 0);
  const { data: menus } = useListMenus();
  const createOrder = useCreateOrder();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      menu_id: preselectedMenuId ?? "",
      service_type: "Cơm văn phòng",
    },
  });

  const guestCount = watch("guest_count") || 0;
  const menuId = watch("menu_id");

  useEffect(() => {
    if (menuId && menus) {
      const menu = (menus as Array<{ id: string; price_per_person: number }>).find((m) => m.id === menuId);
      if (menu) setSelectedPrice(menu.price_per_person);
    }
  }, [menuId, menus]);

  const subtotal = (selectedPrice || preselectedMenuPrice || 0) * guestCount;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const onSubmit = async (data: FormData) => {
    const selectedMenu = (menus as Array<{ id: string; name: string; price_per_person: number }> | undefined)?.find((m) => m.id === data.menu_id);
    try {
      await createOrder.mutateAsync({
        data: {
          ...data,
          menu_name: preselectedMenuName ?? selectedMenu?.name ?? "",
          price_per_person: preselectedMenuPrice ?? selectedMenu?.price_per_person ?? selectedPrice,
          source_page: window.location.pathname,
          utm_source: new URLSearchParams(window.location.search).get("utm_source") ?? "organic",
        } as Parameters<typeof createOrder.mutateAsync>[0]["data"],
      });
      setSubmitted(true);
      toast.success("Đặt tiệc thành công! Chúng tôi sẽ liên hệ trong vòng 2 giờ.");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại hoặc gọi 0909 123 456");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Đặt tiệc thành công!</h3>
        <p className="text-muted-foreground mb-6">Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc để xác nhận đơn hàng.</p>
        <div className="bg-primary/5 rounded-xl p-4 inline-block text-left">
          <p className="text-sm text-muted-foreground">Hotline hỗ trợ:</p>
          <a href="tel:0909123456" className="text-xl font-bold text-primary">0909 123 456</a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Họ và tên *</label>
          <input {...register("customer_name")} placeholder="Nguyễn Văn A"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          {errors.customer_name && <p className="text-destructive text-xs mt-1">{errors.customer_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Số điện thoại *</label>
          <input {...register("phone")} placeholder="0909 123 456"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
          <input {...register("email")} placeholder="email@cong-ty.vn" type="email"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Loại dịch vụ *</label>
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
        </div>
      </div>

      {!preselectedMenuId && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Thực đơn</label>
          <div className="relative">
            <select {...register("menu_id")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none">
              <option value="">-- Chọn thực đơn --</option>
              {(menus as Array<{ id: string; name: string; price_per_person: number }> | undefined)?.map((m) => (
                <option key={m.id} value={m.id}>{m.name} — {formatVND(m.price_per_person)}/người</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <Users className="inline w-4 h-4 mr-1" />Số lượng khách *
          </label>
          <input {...register("guest_count")} type="number" placeholder="50" min="1"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          {errors.guest_count && <p className="text-destructive text-xs mt-1">{errors.guest_count.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <Calendar className="inline w-4 h-4 mr-1" />Ngày tổ chức *
          </label>
          <input {...register("event_date")} type="date"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          {errors.event_date && <p className="text-destructive text-xs mt-1">{errors.event_date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Giờ bắt đầu</label>
          <input {...register("event_time")} type="time"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          <MapPin className="inline w-4 h-4 mr-1" />Địa chỉ tổ chức *
        </label>
        <input {...register("address")} placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
        {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Yêu cầu đặc biệt</label>
        <textarea {...register("notes")} rows={3} placeholder="Yêu cầu về khẩu vị, dị ứng thực phẩm, trang trí..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
      </div>

      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-xl p-4 border border-primary/20"
        >
          <h4 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Tóm tắt chi phí</h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính ({guestCount} người × {formatVND(selectedPrice || preselectedMenuPrice || 0)})</span>
              <span className="font-medium">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí dịch vụ (10%)</span>
              <span className="font-medium">{formatVND(serviceFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-primary/20 font-bold text-base">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatVND(total)}</span>
            </div>
          </div>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={createOrder.isPending}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        {createOrder.isPending ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Đang gửi...</>
        ) : (
          "Đặt tiệc ngay — Nhận báo giá trong 2 giờ"
        )}
      </button>
      <p className="text-center text-xs text-muted-foreground">Không cần đặt cọc. Chúng tôi sẽ liên hệ để xác nhận.</p>
    </form>
  );
}
