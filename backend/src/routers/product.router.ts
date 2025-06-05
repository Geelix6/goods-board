// src/routers/product.routes.ts
import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

// Пагинация: ?page=1&limit=10
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;
