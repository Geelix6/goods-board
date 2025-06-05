// src/services/product.service.ts
import { prisma } from "../db/client";
import { Product, Category, Prisma } from "@prisma/client";

export interface CreateProductDTO {
  title: string;
  category: Category;
  imageUrls: string[];
  price: number;
  description: string;
}

export interface UpdateProductDTO {
  title?: string;
  category?: Category;
  imageUrls?: string[];
  price?: number;
  description?: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  /**
   * Возвращает продукты с пагинацией.
   * @param page — номер страницы (начиная с 1)
   * @param limit — сколько элементов на страницу
   */
  static async getProducts(page: number, limit: number): Promise<PaginatedProducts> {
    // Убедимся, что page и limit >= 1
    const pageNumber = Math.max(page, 1);
    const perPage = Math.max(limit, 1);

    const skip = (pageNumber - 1) * perPage;

    // Сначала получим общее количество записей
    const total = await prisma.product.count();

    // Затем сами продукты
    const data = await prisma.product.findMany({
      skip,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      page: pageNumber,
      limit: perPage,
      total,
      totalPages,
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  static async createProduct(dto: CreateProductDTO): Promise<Product> {
    return prisma.product.create({
      data: {
        title: dto.title,
        category: dto.category,
        imageUrls: dto.imageUrls,
        price: dto.price,
        description: dto.description,
      },
    });
  }

  static async updateProduct(id: string, dto: UpdateProductDTO): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.imageUrls !== undefined && { imageUrls: dto.imageUrls }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  static async deleteProduct(id: string): Promise<Prisma.BatchPayload> {
    return prisma.product.deleteMany({
      where: { id },
    });
  }
}
