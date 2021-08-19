import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikesRepository } from './likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikesRepository])],
})
export class LikesModule {}
