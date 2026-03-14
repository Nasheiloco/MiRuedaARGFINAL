import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const createReviewSchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  vehicle: z.string().min(2).max(100),
  text: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5),
});

router.get("/reviews", async (_req, res) => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(desc(reviewsTable.createdAt));
  res.json(reviews);
});

router.post("/reviews", async (req, res) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(review);
});

export default router;
