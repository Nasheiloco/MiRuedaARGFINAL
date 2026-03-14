import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reviewsRouter from "./reviews";
import productsRouter from "./products";

const router: IRouter = Router();

router.use(healthRouter);
router.use(reviewsRouter);
router.use(productsRouter);

export default router;
