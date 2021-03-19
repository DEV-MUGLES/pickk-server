import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CouriersRepository } from './couriers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CouriersRepository])],
  providers: [],
  exports: [],
})
export class CouriersModule {}
