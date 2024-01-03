import { Router } from "express";
import { createNotice, deleteNotice, fetchNotice,   searchNotice,   showNotice, updateNotices } from "../controller/noticeController";

const router = Router();

router.post("/", createNotice);
router.get("/", fetchNotice);
router.get("/search", searchNotice);
router.get("/:id", showNotice);
router.put("/:id", updateNotices);
router.delete("/:id", deleteNotice);
export default router;