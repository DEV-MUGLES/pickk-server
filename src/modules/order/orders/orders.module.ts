import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersRepository } from './orders.repository';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository])],
  providers: [OrdersResolver],
})
export class OrdersModule {}
