import { Module } from '@nestjs/common';
import { AwsS3ConfigModule } from '@config/providers/aws/s3/config.module';
import { AwsS3ProviderService } from './provider.service';

@Module({
  imports: [AwsS3ConfigModule],
  providers: [AwsS3ProviderService],
  exports: [AwsS3ProviderService],
})
export class AwsS3ProviderModule {}
