import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, leadsTable, customersTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

const anthropic = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] });

async function scoreLeadWithAI(data: { customer_name?: string; phone?: string; email?: string | null; guest_count?: number | null; service_type?: string | null; menu_name?: string | null; menu_price?: number | null; utm_source?: string | null }): Promise<{ score: string; reason: string }> {
  try {
    const prompt = `Bạn là chuyên gia phân tích lead cho công ty catering cao cấp BELUGA tại TPHCM. Hãy chấm điểm khách hàng này dựa trên:
- hot: khách hàng có khả năng chốt đơn cao (số lượng lớn ≥50, có email doanh nghiệp, menu cao cấp, nguồn paid ads)
- warm: khách hàng tiềm năng vừa
- cold: khách hàng khả năng thấp (số lượng nhỏ <15, không có email, nguồn organic)

Thông tin: Tên: ${data.customer_name}, SĐT: ${data.phone}, Email: ${data.email ?? "không có"}, Số lượng: ${data.guest_count ?? "chưa rõ"} người, Dịch vụ: ${data.service_type}, Menu: ${data.menu_name}, Nguồn: ${data.utm_source ?? "organic"}

Trả lời JSON: {"score":"hot|warm|cold","reason":"lý do ngắn gọn 1 câu"}`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const parsed = JSON.parse(text);
    return { score: parsed.score || "warm", reason: parsed.reason || "" };
  } catch {
    const score = (data.guest_count ?? 0) >= 50 ? "hot" : (data.guest_count ?? 0) >= 20 ? "warm" : "cold";
    return { score, reason: "Phân tích tự động" };
  }
}

router.get("/orders", async (req, res) => {
  try {
    const { status, score } = req.query;
    let rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.created_at));
    if (status) rows = rows.filter((r) => r.status === status);
    if (score) rows = rows.filter((r) => r.ai_score === score);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const body = req.body;
    const { score, reason } = await scoreLeadWithAI({
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email,
      guest_count: body.guest_count,
      service_type: body.service_type,
      menu_name: body.menu_name,
      utm_source: body.utm_source,
    });

    const subtotal = (body.price_per_person || 0) * (body.guest_count || 0);
    const service_fee = Math.round(subtotal * 0.1);
    const total_amount = subtotal + service_fee;

    const [order] = await db.insert(ordersTable).values({
      ...body,
      subtotal,
      service_fee,
      total_amount,
      ai_score: score,
      ai_score_reason: reason,
      status: "pending",
    }).returning();

    await db.insert(leadsTable).values({
      menu_name: body.menu_name,
      menu_price: body.price_per_person,
      guest_count: body.guest_count,
      service_type: body.service_type,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email,
      source_page: body.source_page,
      utm_source: body.utm_source,
      ai_score: score,
      ai_score_reason: reason,
    }).onConflictDoNothing();

    try {
      await db.insert(customersTable).values({
        name: body.customer_name,
        phone: body.phone,
        email: body.email,
        total_orders: 1,
        total_spent: total_amount,
        loyalty_points: Math.floor(total_amount / 1000),
        referral_code: Math.random().toString(36).substring(2, 10),
      }).onConflictDoNothing();
    } catch {
    }

    res.status(201).json(order);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notify-lead", async (req, res) => {
  try {
    const body = req.body;
    const { score, reason } = await scoreLeadWithAI({
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email,
      guest_count: body.guest_count,
      service_type: body.service_type,
      menu_name: body.menu_name,
      menu_price: body.menu_price,
      utm_source: body.utm_source,
    });

    const subtotal = (body.menu_price || 0) * (body.guest_count || 0);
    const service_fee = Math.round(subtotal * 0.1);
    const total_amount = subtotal + service_fee;

    const [order] = await db.insert(ordersTable).values({
      menu_name: body.menu_name,
      price_per_person: body.menu_price,
      guest_count: body.guest_count,
      service_type: body.service_type,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email,
      source_page: body.source_page,
      utm_source: body.utm_source,
      subtotal,
      service_fee,
      total_amount,
      ai_score: score,
      ai_score_reason: reason,
      status: "pending",
    }).returning();

    await db.insert(leadsTable).values({
      menu_name: body.menu_name,
      menu_price: body.menu_price,
      guest_count: body.guest_count,
      service_type: body.service_type,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email,
      source_page: body.source_page,
      utm_source: body.utm_source,
      ai_score: score,
      ai_score_reason: reason,
    }).onConflictDoNothing();

    try {
      await db.insert(customersTable).values({
        name: body.customer_name,
        phone: body.phone,
        email: body.email,
        total_orders: 1,
        total_spent: total_amount,
        loyalty_points: Math.floor(total_amount / 1000),
        referral_code: Math.random().toString(36).substring(2, 10),
      }).onConflictDoNothing();
    } catch {}

    res.json({ success: true, order_id: order.id, score });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [row] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
