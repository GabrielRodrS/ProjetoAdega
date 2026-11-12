import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const permitido =
        !origin ||
        origin === 'http://localhost:3001' ||
        /^https:\/\/(stockflow|projeto-adega-two)(-[a-z0-9-]+)?\.vercel\.app$/.test(
          origin,
        );

      callback(null, permitido);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
