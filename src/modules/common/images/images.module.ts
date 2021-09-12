import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AwsS3ProviderModule } from '@providers/aws/s3';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [AwsS3ProviderModule, HttpModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
