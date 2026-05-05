import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, menusTable, leadsTable, customersTable } from "@workspace/db/schema";
import { eq, desc, count, sum, sql } from "drizzle-orm";

const router = Router();

router.get("/analytics/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersTodayResult] = await db
      .select({ count: count() })
      .from(ordersTable)
      .where(sql`${ordersTable.created_at} >= ${today}`);

    const [revenueMonthResult] = await db
      .select({ total: sum(ordersTable.total_amount) })
      .from(ordersTable)
      .where(sql`date_trunc('month', ${ordersTable.created_at}) = date_trunc('month', now())`);

    const [pendingOrdersResult] = await db
      .select({ count: count() })
      .from(ordersTable)
      .where(eq(ordersTable.status, "pending"));

    const [totalCustomersResult] = await db
      .select({ count: count() })
      .from(customersTable);

    res.json({
      orders_today: Number(ordersTodayResult?.count ?? 0),
      revenue_month: Number(revenueMonthResult?.total ?? 0),
      pending_orders: Number(pendingOrdersResult?.count ?? 0),
      total_customers: Number(totalCustomersResult?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/revenue", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT
        to_char(created_at, 'YYYY-MM-DD') as date,
        COALESCE(SUM(total_amount), 0)::bigint as revenue,
        COUNT(*)::int as orders
      FROM orders
      WHERE created_at >= now() - interval '30 days'
      GROUP BY to_char(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/top-menus", async (req, res) => {
  try {
    const rows = await db.select().from(menusTable)
      .where(eq(menusTable.is_active, true))
      .orderBy(desc(menusTable.lead_count), desc(menusTable.view_count))
      .limit(10);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/leads-by-source", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT
        COALESCE(utm_source, 'organic') as source,
        COUNT(*)::int as total,
        COUNT(CASE WHEN ai_score = 'hot' THEN 1 END)::int as hot,
        COUNT(CASE WHEN ai_score = 'warm' THEN 1 END)::int as warm,
        COUNT(CASE WHEN ai_score = 'cold' THEN 1 END)::int as cold
      FROM leads
      GROUP BY COALESCE(utm_source, 'organic')
      ORDER BY total DESC
    `);
    res.json(result.rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/weekly-insight", async (req, res) => {
  try {
    const { siteSettingsTable } = await import("@workspace/db/schema");
    const defaultInsight = {
      insights: [] as string[],
      recommendations: [] as string[],
      generated_at: null as string | null,
      period: "Tuần này",
    };
    const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "weekly_insight"));
    if (row?.value) {
      const stored = row.value as Record<string, unknown>;
      res.json({
        ...defaultInsight,
        ...stored,
        insights: Array.isArray(stored.insights) ? stored.insights : [],
        recommendations: Array.isArray(stored.recommendations) ? stored.recommendations : [],
      });
    } else {
      res.json({
        insights: ["Hệ thống đang thu thập dữ liệu..."],
        recommendations: ["Thêm dữ liệu để nhận phân tích AI"],
        generated_at: new Date().toISOString(),
        period: "Tuần này",
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
