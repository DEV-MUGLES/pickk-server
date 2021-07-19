import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsS3ProviderModule } from '@providers/aws/s3';

import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';
import { BaseImageRepository } from './base-image.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseImageRepository]),
    AwsS3ProviderModule,
  ],
  providers: [ImagesResolver, ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
