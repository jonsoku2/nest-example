import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // 가드 내부 주입으로 인해 문제가 발생한다. (guard내의 constructor)
  // app.useGlobalGuards(new ApiKeyGuard())
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
