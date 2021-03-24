import { Module } from '@nestjs/common';
import { AwsS3ProviderModule } from '@src/providers/aws/s3/provider.module';

import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';

@Module({
  imports: [AwsS3ProviderModule],
  providers: [ImagesResolver, ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
