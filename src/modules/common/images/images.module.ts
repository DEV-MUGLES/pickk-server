import { Module } from '@nestjs/common';

import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';

@Module({
  imports: [ImagesResolver, ImagesService],
})
export class ImagesModule {}
