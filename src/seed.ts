import { NestFactory } from '@nestjs/core';
import { Seeder } from './database/seeders/seeder';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule).then((appContext) => {
    const seeder = appContext.get(Seeder);
    seeder
      .seed()
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        appContext.close();
      });
  });
}

bootstrap();
