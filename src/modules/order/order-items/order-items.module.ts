import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '@item/products/products.module';

import { OrderItemsProcessResolver } from './order-items.process.resolver';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemsRepository]), ProductsModule],
  providers: [OrderItemsProcessResolver, OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
