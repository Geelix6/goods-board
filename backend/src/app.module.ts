import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrismaModule, ProductModule, PrometheusModule.register()],
})
export class AppModule {}
