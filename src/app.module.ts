import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@auth/auth.module';
import { BatchModule } from '@batch/batch.module';
import { AppConfigModule } from '@config/app/config.module';
import { CommonModule } from '@mcommon/common.module';
import { ContentModule } from '@content/content.module';
import { ItemModule } from '@item/item.module';
import { MyModule } from '@my/my.module';
import { UserModule } from '@user/user.module';
import { OrderModule } from '@order/order.module';
import { PaymentModule } from '@payment/payment.module';

import { AwsS3ProviderModule } from '@providers/aws/s3';
import { AwsSqsProviderModule } from '@providers/aws/sqs';
import { CrawlerProviderModule } from '@providers/crawler';
import { RedisCacheProviderModule } from '@providers/cache/redis';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql';
import { SearchModule } from '@providers/elasticsearch';
import { SensProviderModule } from '@providers/sens';
import { SentryProviderModule } from '@providers/sentry';
import { SlackProviderModule } from '@providers/slack';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    CrawlerProviderModule,
    RedisCacheProviderModule,
    MysqlDatabaseProviderModule,
    SearchModule,
    SensProviderModule,
    SentryProviderModule,
    SlackProviderModule,
    AuthModule,
    AdminModule,
    CommonModule,
    ContentModule,
    ItemModule,
    MyModule,
    OrderModule,
    PaymentModule,
    UserModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
