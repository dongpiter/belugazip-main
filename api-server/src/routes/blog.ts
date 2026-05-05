import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/blog", async (req, res) => {
  try {
    const { category, page = "1", limit = "10" } = req.query;
    let rows = await db.select().from(blogPostsTable)
      .where(eq(blogPostsTable.is_published, true))
      .orderBy(desc(blogPostsTable.published_at));
    if (category) rows = rows.filter((r) => r.category === category);
    const total = rows.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = rows.slice(offset, offset + Number(limit));
    res.json({ posts: paginated, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/blog", async (req, res) => {
  try {
    const rows = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.created_at));
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/blog", async (req, res) => {
  try {
    const body = req.body;
    if (body.is_published && !body.published_at) {
      body.published_at = new Date();
    }
    const [row] = await db.insert(blogPostsTable).values(body).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body, updated_at: new Date() };
    if (body.is_published && !body.published_at) {
      body.published_at = new Date();
    }
    const [row] = await db.update(blogPostsTable).set(body).where(eq(blogPostsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [row] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, slug));
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    await db.update(blogPostsTable).set({ view_count: (row.view_count ?? 0) + 1 }).where(eq(blogPostsTable.id, row.id));
    res.json(row);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
