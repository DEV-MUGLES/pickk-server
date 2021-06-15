import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { MysqlConfigModule } from '../../../config/database/mysql/config.module';
import { MysqlConfigService } from '../../../config/database/mysql/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlConfigModule],
      useFactory: async (mysqlConfigService: MysqlConfigService) =>
        ({
          type: 'mysql' as DatabaseType,
          charset: 'utf8',
          host: mysqlConfigService.host,
          port: mysqlConfigService.port,
          username: mysqlConfigService.username,
          password: mysqlConfigService.password,
          database: mysqlConfigService.database,
          entities: [
            __dirname + '../../../../**/*.entity.ts',
            __dirname + '../../../../**/*.entity.js',
          ],
          migrationsRun: mysqlConfigService.migrationsRun,
          migrations: [
            __dirname + '../../../../database/migrations/*.ts',
            __dirname + '../../../../database/migrations/*.js',
          ],
          logging: mysqlConfigService.logging,
          caches: mysqlConfigService.caches,
        } as TypeOrmModuleOptions),
      inject: [MysqlConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
