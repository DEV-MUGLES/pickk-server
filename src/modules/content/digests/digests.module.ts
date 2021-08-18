import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DigestsRepository } from './digests.repository';
import { DigestsResolver } from './digests.resolver';
import { DigestsService } from './digests.service';

@Module({
  imports: [TypeOrmModule.forFeature([DigestsRepository])],
  providers: [DigestsResolver, DigestsService],
})
export class DigestsModule {}
