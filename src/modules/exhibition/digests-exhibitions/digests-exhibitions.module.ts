import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DigestsExhibitionsRepository,
  DigestsExhibitionDigestsRepository,
} from './digests-exhibitions.repository';
import { DigestsExhibitionsResolver } from './digests-exhibitions.resolver';
import { DigestsExhibitionsService } from './digests-exhibitions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigestsExhibitionsRepository,
      DigestsExhibitionDigestsRepository,
    ]),
  ],
  providers: [DigestsExhibitionsResolver, DigestsExhibitionsService],
})
export class DigestsExhibitionsModule {}
