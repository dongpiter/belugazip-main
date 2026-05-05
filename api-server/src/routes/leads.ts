import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db/schema";
import { desc, sql } from "drizzle-orm";

const router = Router();

router.get("/leads", async (req, res) => {
  try {
    const { score } = req.query;
    let rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.created_at));
    if (score) rows = rows.filter((r) => r.ai_score === score);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/leads-by-source", async (req, res) => {
  try {
    const rows = await db.execute(sql`
      SELECT 
        COALESCE(utm_source, 'organic') as source,
        COUNT(*) as total,
        COUNT(CASE WHEN ai_score = 'hot' THEN 1 END) as hot,
        COUNT(CASE WHEN ai_score = 'warm' THEN 1 END) as warm,
        COUNT(CASE WHEN ai_score = 'cold' THEN 1 END) as cold
      FROM leads
      GROUP BY COALESCE(utm_source, 'organic')
      ORDER BY total DESC
    `);
    res.json(rows.rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
