import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "..", "..", "uploads");
mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mirueda2025";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}

const productSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().min(1).max(100),
  category: z.enum(["auto", "moto", "llanta"]),
  size: z.string().min(1).max(50),
  price: z.number().positive().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  inStock: z.boolean(),
});

router.post("/admin/verify", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
  }
});

router.post(
  "/upload",
  requireAdmin,
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No se recibió ningún archivo" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  }
);

router.get("/products", async (req, res) => {
  const { category, brand } = req.query;
  const conditions = [];
  if (category && typeof category === "string") {
    conditions.push(eq(productsTable.category, category));
  }
  if (brand && typeof brand === "string") {
    conditions.push(eq(productsTable.brand, brand));
  }
  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(productsTable.createdAt));
  res.json(products);
});

router.post("/products", requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      ...parsed.data,
      price: parsed.data.price != null ? String(parsed.data.price) : null,
    })
    .returning();
  res.status(201).json(product);
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set({
      ...parsed.data,
      price: parsed.data.price != null ? String(parsed.data.price) : null,
    })
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }
  res.json(product);
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }
  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }
  res.json({ status: "ok" });
});

export default router;
