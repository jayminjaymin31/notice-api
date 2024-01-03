import { Router } from "express";
import noticeRoutes from "./noticeRoutes"

const router = Router();

router.use('/api/notice', noticeRoutes )
export default router;