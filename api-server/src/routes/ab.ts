import { Router } from "express";
import { db } from "@workspace/db";
import { abTestsTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.post("/ab/impression", async (req, res) => {
  try {
    const { test_name, variant } = req.body;
    await db.execute(sql`
      INSERT INTO ab_tests (test_name, variant, impressions, clicks)
      VALUES (${test_name}, ${variant}, 1, 0)
      ON CONFLICT DO NOTHING
    `);
    await db.execute(sql`
      UPDATE ab_tests SET impressions = impressions + 1
      WHERE test_name = ${test_name} AND variant = ${variant}
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ab/click", async (req, res) => {
  try {
    const { test_name, variant } = req.body;
    await db.execute(sql`
      UPDATE ab_tests SET clicks = clicks + 1
      WHERE test_name = ${test_name} AND variant = ${variant}
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ab/stats", async (req, res) => {
  try {
    const rows = await db.select().from(abTestsTable);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
