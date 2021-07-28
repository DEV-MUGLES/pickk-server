import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigModule } from './config/app/config.module';
import { AwsS3ProviderModule } from './providers/aws/s3/provider.module';
import { AwsSqsProviderModule } from '@providers/aws/sqs/provider.module';
import { RedisCacheProviderModule } from './providers/cache/redis';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { SensProviderModule } from './providers/sens/provider.module';
import { SpiderModule } from './providers/spider/provider.module';

import { AuthModule } from './auth/auth.module';

import { CommonModule } from './modules/common/common.module';
import { ItemModule } from './modules/item/item.module';
import { MyModule } from './modules/my/my.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from '@payment/payment.module';

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
    AwsSqsProviderModule,
    RedisCacheProviderModule,
    MysqlDatabaseProviderModule,
    SensProviderModule,
    SpiderModule,
    AuthModule,
    CommonModule,
    ItemModule,
    MyModule,
    OrderModule,
    PaymentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
