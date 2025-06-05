// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from "express";

/**
 * Структура единого ответа при ошибке:
 * {
 *   status: "error",
 *   message: string,
 *   errorCode?: string,       // например, код Prisma или кастомный код
 *   details?: any             // дополнительные данные (stack, валидация и т.п.)
 * }
 */
interface ErrorResponse {
  status: "error";
  message: string;
  errorCode?: string;
  details?: any;
}

export function errorHandler(err: any, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  // Логируем ошибку в консоль (можно убрать или заменить на Winston/логгер)
  console.error(err);

  // Если спрятана информация о статус-коде (например, мы создали вручную в контроллере),
  // можно взять err.statusCode, иначе дефолтим 500.
  const statusCode = err.statusCode && typeof err.statusCode === "number" ? err.statusCode : 500;

  // Базовый шаблон ответа
  const response: ErrorResponse = {
    status: "error",
    message: err.message || "Internal Server Error",
  };

  // Если есть код ошибки (например, Prisma выдает err.code = "P2025" и т.п.), можно отправить его клиенту
  if (err.code && typeof err.code === "string") {
    response.errorCode = err.code;
  }

  // В режиме разработки (NODE_ENV !== "production") можно вернуть подробности (stack, validation errors и т.д.)
  if (process.env.NODE_ENV !== "production") {
    response.details = {
      stack: err.stack,
      // если это ошибка валидации (например, зод, joi и т.п.), можно вернуть err.details
      ...(err.details ? { validation: err.details } : {}),
    };
  }

  // Отправляем JSON с единым форматом
  return res.status(statusCode).json(response);
}
