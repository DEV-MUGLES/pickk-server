import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsRepository } from './products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsRepository])],
})
export class ProductsModule {}
