import { Module } from '@nestjs/common';

import { SellersModule } from '@item/sellers/sellers.module';
import { UsersModule } from '@user/users/users.module';

import { MyCommonResolver } from './resolvers/my-common.resolver';

@Module({
  imports: [UsersModule, SellersModule],
  providers: [MyCommonResolver],
})
export class MyModule {}
