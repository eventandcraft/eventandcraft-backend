import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(compression());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EventCraft API Documentation')
    .setDescription('API documentation for EventCraft API implementation')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(process.env.SWAGGER_DOC_URL ?? 'doc', app, doc, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app
    .listen(process.env.PORT ?? 4000)
    .then(() => console.log(` server running on port ${process.env.PORT}`));
}
bootstrap();
