import { Router } from "express"
const router = Router();
import { requireAuth } from "@clerk/express"
import { createComment, deleteComment } from "../controllers/comment.controller";

router.post("/api/:productId", requireAuth(), createComment);
router.delete("/api/:commentId", requireAuth(), deleteComment);

export default router;