import { NestFactory } from '@nestjs/core';
import { Seeder } from './database/seeders/seeder';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seeder = appContext.get(Seeder);
  try {
    await seeder.seed();
    console.log('success');
  } catch (err) {
    console.log(err);
  } finally {
    appContext.close();
  }
}

bootstrap();
