import { NestFactory } from '@nestjs/core';
import { ConsoleLogger } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  Counter,
  Histogram,
  register,
  collectDefaultMetrics,
} from 'prom-client';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: new ConsoleLogger({
      json: true,
    }),
  });

  // МОНИТОРИНГ - вариант 1, работа с prom-client напрямую

  // 1) собираем «дефолтные» метрики nodejs / process
  collectDefaultMetrics();

  // 2) создаём свои HTTP‑метрики
  const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'] as const,
  });

  const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'] as const,
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  // 3) заводим middleware для учёта каждой обработки запроса
  // типизацию можно позже настроить, чтобы не было any
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      // нет смысла мониторить скорость работы на /metrics и на отдаче статики
      // статика не только же фавиконка может быть, как лучше сделать проверку?
      if (req.path.startsWith('/metrics') || req.path === '/favicon.ico') {
        return next();
      }

      const end = httpRequestDuration.startTimer();
      res.on('finish', () => {
        const route = req.route?.path || req.path;
        httpRequestsTotal
          .labels(req.method, route, res.statusCode.toString())
          .inc();
        end({
          method: req.method,
          route,
          status_code: res.statusCode.toString(),
        });
      });
      next();
    },
  );

  // 4) точка экспорта метрик
  app.use('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  await app.listen(process.env.PORT || 5001);
  // это тоже можно было бы через json logger пустить
  console.log(`🚀 Listening on ${process.env.PORT || 5000}`);
}

void bootstrap();
