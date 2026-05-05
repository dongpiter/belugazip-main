import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@workspace/db";
import { menusTable, chatSessionsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] });

router.post("/ai/recommend-menu", async (req, res) => {
  try {
    const { guest_count, service_type, budget_per_person, dietary_preference, event_type } = req.body;
    const menus = await db.select().from(menusTable).where(eq(menusTable.is_active, true));

    const prompt = `Bạn là chuyên gia tư vấn catering của BELUGA tại TPHCM. Dựa trên thông tin khách hàng, hãy gợi ý 3 menu phù hợp nhất.

Thông tin:
- Số khách: ${guest_count ?? "chưa rõ"}
- Loại dịch vụ: ${service_type ?? "chưa rõ"}
- Ngân sách/người: ${budget_per_person ? budget_per_person + "đ" : "linh hoạt"}
- Yêu cầu đặc biệt: ${dietary_preference ?? "không có"}
- Loại sự kiện: ${event_type ?? "chưa rõ"}

Danh sách menu (JSON):
${JSON.stringify(menus.map((m) => ({ id: m.id, name: m.name, slug: m.slug, price: m.price_per_person, category: m.category, description: m.description, image_url: m.image_url })))}

Hãy trả lời JSON theo format:
[{"menu_id":"...","menu_name":"...","reason":"lý do phù hợp","match_score":0-100,"price_per_person":0,"image_url":"..."}]`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json(recommendations);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "AI service error" });
  }
});

router.post("/ai/score-lead", async (req, res) => {
  try {
    const data = req.body;
    const prompt = `Chấm điểm lead cho BELUGA Catering TPHCM. Trả lời JSON: {"score":"hot|warm|cold","reason":"1 câu"}
Thông tin: ${JSON.stringify(data)}
hot=số lượng lớn/email doanh nghiệp/sự kiện lớn, warm=tiềm năng vừa, cold=nhỏ/không có email`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: "warm", reason: "Phân tích tự động" };
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.json({ score: "warm", reason: "Không thể phân tích" });
  }
});

router.post("/ai/chat", async (req, res) => {
  try {
    const { message, session_id, history } = req.body;

    const systemPrompt = `Bạn là trợ lý AI của BELUGA Catering — công ty catering cao cấp tại TP.HCM. 
Nhiệm vụ: tư vấn dịch vụ catering, trả lời câu hỏi về menu, giá cả, quy trình đặt tiệc.
Luôn trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
Giá: Cơm VP 85k-150k/suất, Tiệc sự kiện 180k-350k/người, Buffet 200k+/người, Teabreak 120k+/người.
SĐT: 0909 123 456. Email: hello@belugacatering.vn`;

    const messages: Anthropic.MessageParam[] = [
      ...(history ?? []).map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const reply = (msg.content[0] as { type: string; text: string }).text;

    if (session_id) {
      await db.insert(chatSessionsTable).values([
        { session_id, role: "user", content: message },
        { session_id, role: "assistant", content: reply },
      ]);
    }

    res.json({ reply });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "AI service error" });
  }
});

router.post("/ai/generate-blog", async (req, res) => {
  try {
    const { topic, keywords, target_audience } = req.body;

    const prompt = `Viết một bài blog SEO chuyên nghiệp cho BELUGA Catering TPHCM về chủ đề: "${topic}"
Keywords: ${keywords ?? topic}
Đối tượng đọc: ${target_audience ?? "doanh nghiệp TPHCM"}

Yêu cầu:
- Tiêu đề hấp dẫn, có keyword
- 4-6 đoạn văn với thẻ H2
- Có internal link đến /com-van-phong hoặc /dat-tiec-cong-ty
- CTA cuối bài
- Viết bằng HTML với các thẻ h2, p, ul, li
- Dài khoảng 600-800 từ

Trả lời JSON: {"title":"...","content":"HTML content...","excerpt":"tóm tắt 1-2 câu","meta_title":"...","meta_description":"...","tags":["tag1","tag2"],"reading_time":5}`;

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: topic, content: text, excerpt: "" };
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "AI service error" });
  }
});

router.post("/ai/generate-quote-email", async (req, res) => {
  try {
    const order = req.body;

    const prompt = `Viết email báo giá chuyên nghiệp cho khách hàng đặt catering BELUGA.

Thông tin đơn hàng:
- Khách hàng: ${order.customer_name}
- Dịch vụ: ${order.service_type}
- Menu: ${order.menu_name}
- Số lượng: ${order.guest_count} người
- Ngày tổ chức: ${order.event_date}
- Địa điểm: ${order.address}
- Tổng tiền: ${order.total_amount?.toLocaleString("vi-VN")}đ

Viết email bằng tiếng Việt, lịch sự, chuyên nghiệp. Có đủ: lời chào, tóm tắt dịch vụ, bảng giá chi tiết, điều khoản thanh toán (đặt cọc 30%), thông tin liên hệ BELUGA.`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const emailContent = (msg.content[0] as { type: string; text: string }).text;
    res.json({ email: emailContent });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "AI service error" });
  }
});

router.get("/ai/weekly-insight", async (req, res) => {
  try {
    const { siteSettingsTable } = await import("@workspace/db/schema");
    const { eq } = await import("drizzle-orm");
    const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "weekly_insight"));
    const defaultInsight = {
      insights: [
        "Tháng này chưa có đủ dữ liệu để phân tích.",
        "Hệ thống đang theo dõi các chỉ số kinh doanh.",
        "Menu Tiệc Trưa Thành Công được xem nhiều nhất.",
      ],
      recommendations: [
        "Tăng cường quảng bá trên Zalo để đạt thêm leads.",
        "Cập nhật thêm ảnh thực đơn để tăng tỷ lệ chuyển đổi.",
        "Theo dõi tỷ lệ phản hồi lead trong 24h đầu.",
      ],
      generated_at: new Date().toISOString(),
      period: "Tuần này",
    };
    if (row?.value && typeof row.value === "object" && !Array.isArray(row.value)) {
      const val = row.value as Record<string, unknown>;
      res.json({ ...defaultInsight, ...val });
    } else {
      res.json(defaultInsight);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ai/weekly-insight", async (req, res) => {
  try {
    const { siteSettingsTable, ordersTable, leadsTable, menusTable: menusTbl } = await import("@workspace/db/schema");
    const { eq, gte, sql: sqlExpr, count, sum } = await import("drizzle-orm");

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [orderStats] = await db.select({ total: count(), revenue: sum(ordersTable.total_amount) })
      .from(ordersTable).where(gte(ordersTable.created_at, since));

    const [leadStats] = await db.select({ total: count() }).from(leadsTable).where(gte(leadsTable.created_at, since));

    const topMenus = await db.select({ name: menusTbl.name, view_count: menusTbl.view_count, lead_count: menusTbl.lead_count })
      .from(menusTbl).where(eq(menusTbl.is_active, true)).limit(5);

    const prompt = `Bạn là chuyên gia phân tích kinh doanh catering. Phân tích dữ liệu 7 ngày qua của BELUGA Catering TPHCM:
- Đơn hàng: ${orderStats?.total ?? 0}
- Doanh thu: ${Number(orderStats?.revenue ?? 0).toLocaleString("vi-VN")}đ
- Leads mới: ${leadStats?.total ?? 0}
- Top menus: ${topMenus.map((m) => `${m.name} (${m.view_count ?? 0} views, ${m.lead_count ?? 0} leads)`).join("; ")}

Trả về JSON theo format (không markdown, chỉ JSON thuần):
{"insights":["insight 1 ngắn gọn","insight 2","insight 3"],"recommendations":["đề xuất 1","đề xuất 2"]}`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const insight = {
      insights: parsed.insights ?? ["Dữ liệu tuần này đang được phân tích."],
      recommendations: parsed.recommendations ?? ["Tiếp tục theo dõi chỉ số hàng ngày."],
      generated_at: new Date().toISOString(),
      period: `Tuần ${new Date().toLocaleDateString("vi-VN")}`,
    };

    await db.insert(siteSettingsTable).values({ key: "weekly_insight", value: insight })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: insight, updated_at: new Date() } });

    res.json(insight);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "AI service error" });
  }
});

export default router;
