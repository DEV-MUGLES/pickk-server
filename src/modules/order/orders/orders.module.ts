import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersRepository } from './orders.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository])],
})
export class OrdersModule {}
