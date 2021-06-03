import { Module } from '@nestjs/common';

import { AwsS3ProviderModule } from '@src/providers/aws/s3/provider.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { UsersModule } from '@user/users/users.module';

import { MyCommonResolver } from './resolvers/my-common.resolver';
import { MySellerResolver } from './resolvers/my-seller.resolver';
import { CouponsModule } from '../order/coupons/coupons.module';

@Module({
  imports: [UsersModule, SellersModule, AwsS3ProviderModule, CouponsModule],
  providers: [MyCommonResolver, MySellerResolver],
})
export class MyModule {}
