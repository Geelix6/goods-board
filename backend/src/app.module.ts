import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
// по сути "@willsoto/nestjs-prometheus" — вообще не нужен сейчас, т.к. мы используем prom-client напрямую
// import {
//   PrometheusModule,
//   makeCounterProvider,
//   makeHistogramProvider,
// } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        timestamp: true,
        genReqId: () => uuid(),
        formatters: {
          level(label: string /* = 'info'|'debug'… */) {
            return { level: label };
          },
        },
      },
    }),
    // PrometheusModule.register({
    //   defaultMetrics: { enabled: true },
    //   global: true, -- даже вот это не сработало, странно
    // }),
    PrismaModule,
    ProductModule,
  ],
  // вариант 2 с @InjectMetric не сработал UnknownDependenciesException [Error]: Nest can't resolve dependencies...
  // providers: [
  //   // создадим счётчик запросов на основе HTTP‑метрик
  //   makeCounterProvider({
  //     name: 'http_requests_total',
  //     help: 'Total number of HTTP requests',
  //     labelNames: ['method', 'route', 'status_code'],
  //   }),
  //   // гистограмма для задержек
  //   makeHistogramProvider({
  //     name: 'http_request_duration_seconds',
  //     help: 'HTTP request latency in seconds',
  //     labelNames: ['method', 'route', 'status_code'],
  //     buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2, 5],
  //   }),
  // ],
})
export class AppModule {}
