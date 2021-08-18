import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideosRepository } from './videos.repository';
import { VideosResolver } from './videos.resolver';
import { VideosService } from './videos.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideosRepository])],
  providers: [VideosResolver, VideosService],
})
export class VideosModule {}
