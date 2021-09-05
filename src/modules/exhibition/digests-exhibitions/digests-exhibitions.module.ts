import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DigestsExhibitionsRepository } from './digests-exhibitions.repository';
import { DigestsExhibitionsResolver } from './digests-exhibitions.resolver';
import { DigestsExhibitionsService } from './digests-exhibitions.service';

@Module({
  imports: [TypeOrmModule.forFeature([DigestsExhibitionsRepository])],
  providers: [DigestsExhibitionsResolver, DigestsExhibitionsService],
})
export class DigestsExhibitionsModule {}
