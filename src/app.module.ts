import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigModule } from './config/app/config.module';
import { AwsS3ProviderModule } from './providers/aws/s3/provider.module';
import { BullProviderModule } from './providers/bull/provider.module';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { SpiderModule } from './providers/spider/provider.module';

import { AuthModule } from './authentication/auth.module';
import { jobModules } from './jobs';

import { CommonModule } from './modules/common/common.module';
import { ItemModule } from './modules/item/item.module';
import { MyModule } from './modules/my/my.module';
import { UserModule } from './modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      playground: true,
      introspection: true,
      cors: true,
    }),
    AppConfigModule,
    AwsS3ProviderModule,
    BullProviderModule,
    MysqlDatabaseProviderModule,
    SpiderModule,
    AuthModule,
    ...jobModules,
    CommonModule,
    ItemModule,
    MyModule,
    OrderModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
