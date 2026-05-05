import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menusRouter from "./menus";
import ordersRouter from "./orders";
import blogRouter from "./blog";
import settingsRouter from "./settings";
import customersRouter from "./customers";
import leadsRouter from "./leads";
import analyticsRouter from "./analytics";
import authRouter from "./auth";
import aiRouter from "./ai";
import abRouter from "./ab";
import seoRouter from "./seo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menusRouter);
router.use(ordersRouter);
router.use(blogRouter);
router.use(settingsRouter);
router.use(customersRouter);
router.use(leadsRouter);
router.use(analyticsRouter);
router.use(aiRouter);
router.use(abRouter);
router.use(seoRouter);

export default router;
