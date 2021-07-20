import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsRepository } from './order-items.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemsRepository])],
})
export class OrderItemsModule {}
