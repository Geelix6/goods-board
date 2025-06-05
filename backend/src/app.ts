// src/app.ts
import express, { json } from "express";
import productRoutes from "./routers/product.router";

const app = express();

// Middlewares
app.use(json());

// Префикс для всех маршрутов
app.use("/api/products", productRoutes);

// глобальный обработчик ошибок

// 404 для несуществующих роутов
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
