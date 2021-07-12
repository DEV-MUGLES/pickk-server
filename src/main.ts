import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

const APP_CONFIG_SERVICE = 'AppConfigService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get(APP_CONFIG_SERVICE);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('pickk-server')
    .setDescription('The pickk-server API description')
    .setVersion('1.0')
    .addTag('spider')
    .addTag('coupons')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appConfig.port);
}
bootstrap();
