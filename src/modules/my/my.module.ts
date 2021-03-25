import { Module } from '@nestjs/common';

import { AwsS3ProviderModule } from '@src/providers/aws/s3/provider.module';

import { UsersModule } from '../user/users/users.module';
import { MyResolver } from './my.resolver';

@Module({
  imports: [UsersModule, AwsS3ProviderModule],
  providers: [MyResolver],
})
export class MyModule {}
