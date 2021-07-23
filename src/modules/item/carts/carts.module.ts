import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemsRepository } from './carts.repository';
import { CartsResolver } from './carts.resolver';
import { CartsService } from './carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemsRepository])],
  providers: [CartsResolver, CartsService],
  exports: [CartsService],
})
export class CartsModule {}
