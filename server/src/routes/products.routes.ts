import { Router } from "express"
const router = Router();
import { requireAuth } from "@clerk/express"
import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from "../controllers/product.controller";


router.get("/", getAllProducts);
router.get("/my", requireAuth(), getMyProducts);
router.get("/:id", getProductById);
router.post("/create", requireAuth(), createProduct);
router.put("/update/:id", requireAuth(), updateProduct);
router.delete("/:id", requireAuth(), deleteProduct);

export default router;