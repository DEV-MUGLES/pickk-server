import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CouriersRepository } from './couriers.repository';
import { CouriersResolver } from './couriers.resolver';
import { CouriersService } from './couriers.service';

@Module({
  imports: [TypeOrmModule.forFeature([CouriersRepository])],
  providers: [CouriersResolver, CouriersService],
  exports: [CouriersService],
})
export class CouriersModule {}
