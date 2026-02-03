import { Router } from "express"
import { syncUser } from "../controllers/user.controller";
import { requireAuth } from "@clerk/express";
const router = Router();

//  /api/users/sync --> POST => syncing the clerk user to DB
router.post("/sync", requireAuth() ,syncUser);

export default router;