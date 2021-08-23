import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnsRepository } from './owns.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OwnsRepository])],
})
export class OwnsModule {}
