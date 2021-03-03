import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AppConfigModule } from './config/app/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { AuthModule } from './authentication/auth.module';
import { UsersModule } from './modules/user/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
    }),
    MysqlDatabaseProviderModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
