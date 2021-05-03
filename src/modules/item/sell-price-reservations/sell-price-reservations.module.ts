import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellPriceReservationsRepository } from './sell-price-reservations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SellPriceReservationsRepository])],
})
export class SellPriceReservationsModule {}
