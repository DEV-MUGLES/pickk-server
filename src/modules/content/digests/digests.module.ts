import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DigestsRepository } from './digests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DigestsRepository])],
})
export class DigestsModule {}
