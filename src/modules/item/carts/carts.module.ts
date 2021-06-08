import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemsRepository } from './carts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemsRepository])],
})
export class CartsModule {}
