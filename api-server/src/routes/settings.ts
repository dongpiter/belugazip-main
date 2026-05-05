import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
    if (existing) {
      const [row] = await db.update(siteSettingsTable).set({ value, updated_at: new Date() }).where(eq(siteSettingsTable.key, key)).returning();
      res.json(row);
    } else {
      const [row] = await db.insert(siteSettingsTable).values({ key, value }).returning();
      res.status(201).json(row);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
