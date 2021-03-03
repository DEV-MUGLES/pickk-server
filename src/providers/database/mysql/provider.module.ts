import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { MysqlConfigModule } from '../../../config/database/mysql/config.module';
import { MysqlConfigService } from '../../../config/database/mysql/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlConfigModule],
      useFactory: async (mysqlConfigService: MysqlConfigService) => ({
        type: 'mysql' as DatabaseType,
        charset: 'utf8',
        host: mysqlConfigService.host,
        port: mysqlConfigService.port,
        username: mysqlConfigService.username,
        password: mysqlConfigService.password,
        database: mysqlConfigService.database,
        entities: [
          __dirname + '../../../../**/*.model.ts',
          __dirname + '../../../../**/*.model.js',
        ],
        migrationsRun: false,
        migrations: [
          __dirname + '../../../../database/migrations/*.ts',
          __dirname + '../../../../database/migrations/*.js',
        ],
      }),
      inject: [MysqlConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
