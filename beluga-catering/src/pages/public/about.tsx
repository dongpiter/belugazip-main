import { motion } from "framer-motion";
import { Link } from "wouter";
import { Award, Users, Clock, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const stats = [
  { icon: Award, value: "500+", label: "Sự kiện thành công" },
  { icon: Users, value: "150+", label: "Khách hàng doanh nghiệp" },
  { icon: Clock, value: "8+", label: "Năm kinh nghiệm" },
  { icon: Leaf, value: "100%", label: "Nguyên liệu tươi mỗi ngày" },
];

const team = [
  { name: "Chef Nguyễn Minh Tuấn", role: "Bếp trưởng điều hành", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80", desc: "15 năm kinh nghiệm tại các nhà hàng 5 sao TPHCM và Singapore" },
  { name: "Trần Thị Phương", role: "Giám đốc vận hành", image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80", desc: "Chuyên gia quản lý sự kiện ẩm thực cấp doanh nghiệp" },
  { name: "Lê Hoàng Nam", role: "Trưởng phòng kinh doanh", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", desc: "Tư vấn giải pháp catering cho 100+ doanh nghiệp" },
];

const partners = [
  "Vingroup", "FPT Corporation", "Techcombank", "KPMG Vietnam", "Masan Group", "VinFast",
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-16 h-64 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=90"
          alt="BELUGA Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white">Về BELUGA Catering</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Câu chuyện của chúng tôi</span>
            <h2 className="text-3xl font-black text-foreground mt-2 mb-4">Từ Bếp Nhỏ Đến Thương Hiệu Catering Hàng Đầu TPHCM</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>BELUGA Catering được thành lập năm 2016 với sứ mệnh mang nghệ thuật ẩm thực cao cấp đến mọi sự kiện doanh nghiệp tại TP.HCM. Khởi đầu từ một đội bếp nhỏ 5 người, chúng tôi đã phát triển thành công ty catering chuyên nghiệp với hơn 50 nhân sự.</p>
              <p>Triết lý của BELUGA rất đơn giản: mỗi bữa ăn là một trải nghiệm, không phải chỉ là thức ăn. Chúng tôi tin rằng chất lượng bữa ăn ảnh hưởng trực tiếp đến năng suất làm việc và tinh thần của nhân viên.</p>
              <p>Với cam kết sử dụng nguyên liệu tươi mỗi ngày, đội ngũ đầu bếp có trình độ cao và quy trình kiểm soát chất lượng nghiêm ngặt, BELUGA đã trở thành đối tác catering tin cậy của hơn 150 doanh nghiệp tại TPHCM.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80"
              alt="BELUGA Team"
              className="rounded-3xl w-full h-72 object-cover shadow-xl"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-black text-foreground mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Đội ngũ</span>
            <h2 className="text-3xl font-black text-foreground mt-2">Những Con Người Đằng Sau BELUGA</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary/10"
                />
                <h3 className="font-bold text-foreground text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Đối tác tin tưởng</span>
            <h2 className="text-3xl font-black text-foreground mt-2">Được Tin Dùng Bởi</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl px-6 py-4 text-sm font-bold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary text-white text-center py-16">
        <h2 className="text-3xl font-black mb-4">Sẵn Sàng Hợp Tác?</h2>
        <p className="text-white/80 mb-6">Liên hệ ngay để nhận tư vấn miễn phí</p>
        <Link href="/contact">
          <span className="inline-block bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-colors cursor-pointer">
            Liên hệ ngay
          </span>
        </Link>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
