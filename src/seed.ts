import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppSeeder } from './database/seeders/app.seeder';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seeder = appContext.get(AppSeeder);
  const logger = appContext.get(Logger);
  try {
    await seeder.seed();
    logger.debug('Seeding Completed!');
  } catch (err) {
    logger.error('Seeding Failed.');
    throw err;
  } finally {
    appContext.close();
  }
}

bootstrap();
