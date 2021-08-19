import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikesRepository } from './likes.repository';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikesRepository])],
  providers: [LikesResolver, LikesService],
})
export class LikesModule {}
