import {
  Controller,
  UsePipes,
  ValidationPipe,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
// import { Counter, Histogram } from 'prom-client';
// import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/shared/pagination/pagination.dto';
import { PaginatedResult } from 'src/shared/pagination/pagination.interface';

@Controller('api/products')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
)
export class ProductController {
  // вариант 2 с @InjectMetric не сработал UnknownDependenciesException [Error]: Nest can't resolve dependencies...
  // можно было бы попробовать создать PrometheusModule, не на уровне AppModule, а на уровне ProductModule,
  // но это странно, он же должен быть глобальным, чтобы не создавать его заново в каждом модуле

  // constructor(@InjectMetric
  //   private readonly productService: ProductService,
  //   @InjectMetric('http_requests_total') private counter: Counter<string>,
  //   @InjectMetric('http_request_duration_seconds')
  //   private histo: Histogram<string>,
  // ) {}

  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResult<Product>> {
    // const end = this.histo.startTimer();

    const errorResp = Math.random() < 0.5 ? 502 : 410;

    if (Math.random() < 0.03) {
      throw new HttpException('oops', errorResp);
    }

    const { page, limit } = paginationDto;
    const result = this.productService.getProducts(page, limit);

    // end({ status_code: '200' });
    // this.counter.labels('GET', '/api/products', '200').inc();

    return result;
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(dto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
