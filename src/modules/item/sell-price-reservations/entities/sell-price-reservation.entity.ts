import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { ISellPriceReservation } from '../interfaces/sell-price-reservation.interface';
import { ItemEntity } from '../../items/entities/item.entity';

@ObjectType()
@Entity('sell_price_reservation')
@Index(['isActive', 'startAt'])
@Index(['isActive', 'endAt'])
export class SellPriceReservationEntity
  extends BaseIdEntity
  implements ISellPriceReservation {
  @Field()
  @Column()
  isActive: boolean;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  destSellPrice: number;

  @Field()
  @Column()
  isRollbackByCrawl: boolean;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  rollbackSellPrice?: number;

  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startAt: Date;

  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  endAt: Date;

  @OneToOne('ItemEntity', 'sellPriceReservation', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;
}
