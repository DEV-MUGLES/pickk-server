import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppConfigModule } from './config/app/config.module';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';

import { UsersModule } from './models/users/users.module';

@Module({
  imports: [AppConfigModule, MysqlDatabaseProviderModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
