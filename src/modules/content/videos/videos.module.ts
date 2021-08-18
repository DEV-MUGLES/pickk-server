import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideosRepository } from './videos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VideosRepository])],
})
export class VideosModule {}
