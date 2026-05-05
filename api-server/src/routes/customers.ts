import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/customers", async (req, res) => {
  try {
    const rows = await db.select().from(customersTable).orderBy(desc(customersTable.total_spent));
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
