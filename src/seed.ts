import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seederService = appContext.get(SeederService);
  const logger = appContext.get(Logger);
  try {
    await seederService.seed();
    logger.debug('Seeding Completed!');
  } catch (err) {
    logger.error('Seeding Failed.');
    throw err;
  } finally {
    appContext.close();
  }
}

bootstrap();
