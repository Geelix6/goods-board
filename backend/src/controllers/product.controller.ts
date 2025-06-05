// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { Category } from "@prisma/client";

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Параметры пагинации: ?page=1&limit=10
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "10", 10);

      const result = await ProductService.getProducts(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, category, imageUrls, price, description } = req.body;

      // Приведём category к enum Category
      if (!Object.values(Category).includes(category)) {
        res.status(400).json({ message: "Invalid category" });
        return;
      }

      const newProduct = await ProductService.createProduct({
        title,
        category,
        imageUrls,
        price,
        description,
      });
      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, category, imageUrls, price, description } = req.body;

      // Если передано category, проверим валидность
      if (category !== undefined && !Object.values(Category).includes(category)) {
        res.status(400).json({ message: "Invalid category" });
        return;
      }

      const updatedProduct = await ProductService.updateProduct(id, {
        title,
        category,
        imageUrls,
        price,
        description,
      });
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
