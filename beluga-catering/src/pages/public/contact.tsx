import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ChatWidget from "@/components/ChatWidget";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-10 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Liên hệ</span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mt-2 mb-4">Nhận Báo Giá Ngay Hôm Nay</h1>
          <p className="text-muted-foreground text-lg">Phản hồi trong vòng 2 giờ làm việc — Không cần đặt cọc khi tư vấn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-black text-foreground mb-6">Thông Tin Liên Hệ</h2>

          <div className="space-y-4 mb-8">
            {[
              { icon: Phone, title: "Hotline", value: "0909 123 456", href: "tel:0909123456", desc: "Thứ 2-7: 7:00 - 20:00" },
              { icon: Mail, title: "Email", value: "hello@belugacatering.vn", href: "mailto:hello@belugacatering.vn", desc: "Phản hồi trong 2 giờ" },
              { icon: MapPin, title: "Địa chỉ", value: "TP. Hồ Chí Minh", href: "#", desc: "Phục vụ toàn TP.HCM và vùng lân cận" },
              { icon: Clock, title: "Giờ làm việc", value: "7:00 — 20:00", href: "#", desc: "Thứ 2 đến Thứ 7" },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.title}</p>
                  <a href={item.href} className="font-bold text-foreground hover:text-primary transition-colors">{item.value}</a>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="h-64 bg-muted rounded-2xl overflow-hidden border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">TP. Hồ Chí Minh</p>
              <p className="text-sm">Phục vụ toàn thành phố</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-foreground mb-6">Gửi Yêu Cầu Báo Giá</h2>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <BookingForm />
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
