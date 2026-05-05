import { Router } from "express";
import { db } from "@workspace/db";
import { menusTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/menus", async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = db.select().from(menusTable).where(eq(menusTable.is_active, true)).$dynamic();
    const rows = await db.select().from(menusTable).where(eq(menusTable.is_active, true)).orderBy(desc(menusTable.is_featured), desc(menusTable.created_at));
    let result = rows;
    if (category && category !== "all") {
      result = result.filter((m) => m.category === category);
    }
    if (featured === "true") {
      result = result.filter((m) => m.is_featured === true);
    }
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/menus", async (req, res) => {
  try {
    const rows = await db.select().from(menusTable).orderBy(desc(menusTable.created_at));
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/menus", async (req, res) => {
  try {
    const body = req.body;
    const [row] = await db.insert(menusTable).values(body).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/menus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body, updated_at: new Date() };
    const [row] = await db.update(menusTable).set(body).where(eq(menusTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/menus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(menusTable).where(eq(menusTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menus/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [row] = await db.select().from(menusTable).where(eq(menusTable.slug, slug));
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    await db.update(menusTable).set({ view_count: (row.view_count ?? 0) + 1 }).where(eq(menusTable.id, row.id));
    res.json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
