import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellersModule } from '../sellers/sellers.module';

import { BrandsRepository } from './brands.repository';
import { BrandsResolver } from './brands.resolver';
import { BrandsService } from './brands.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandsRepository]),
    forwardRef(() => SellersModule),
  ],
  providers: [BrandsResolver, BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
