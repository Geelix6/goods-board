import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResult } from 'src/shared/pagination/pagination.interface';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<Product>> {
    const pageNumber = Math.max(page, 1);
    const perPage = Math.max(limit, 1);
    const skip = (pageNumber - 1) * perPage;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.product.count(),
      this.prisma.product.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    const totalPages = Math.ceil(total / perPage);

    return { data, total, page: pageNumber, limit: perPage, totalPages };
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        category: dto.category,
        imageUrls: dto.imageUrls,
        price: dto.price,
        description: dto.description,
      },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.product.update({
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

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.product.deleteMany({ where: { id } });
  }
}
