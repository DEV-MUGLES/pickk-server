import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AppConfigModule } from './config/app/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { AwsS3ProviderModule } from './providers/aws/s3/provider.module';

import { AuthModule } from './authentication/auth.module';
import { ItemModule } from './modules/item/item.module';
import { MyModule } from './modules/my/my.module';
import { UserModule } from './modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    AppConfigModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
    }),
    MysqlDatabaseProviderModule,
    AwsS3ProviderModule,
    AuthModule,
    CommonModule,
    ItemModule,
    MyModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
