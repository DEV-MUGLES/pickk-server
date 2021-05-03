import { ObjectType } from '@nestjs/graphql';

import { SellPriceReservationEntity } from '../entities/sell-price-reservation.entity';

@ObjectType()
export class SellPriceReservation extends SellPriceReservationEntity {}
