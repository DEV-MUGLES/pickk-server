import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SaleStrategyRepository } from '@common/repositories';

import { SellersRepository } from './sellers.repository';
import { SellersResolver } from './sellers.resolver';
import { SellersService } from './sellers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRepository, SaleStrategyRepository]),
  ],
  providers: [SellersResolver, SellersService],
  exports: [SellersService],
})
export class SellersModule {}
