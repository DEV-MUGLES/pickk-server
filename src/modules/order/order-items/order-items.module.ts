import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsProcessResolver } from './order-items.process.resolver';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemsRepository])],
  providers: [OrderItemsProcessResolver, OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
