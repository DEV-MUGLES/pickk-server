import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { SaleStrategyEntity } from '@common/entities';

import { ISeller, ISellerSaleStrategy } from '../interfaces';

@ObjectType()
@Entity('seller_sale_strategy')
export class SellerSaleStrategyEntity
  extends SaleStrategyEntity
  implements ISellerSaleStrategy
{
  constructor(attributes?: Partial<SellerSaleStrategyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.pickkDiscountRate = attributes.pickkDiscountRate;
  }

  @OneToOne('SellerEntity', 'crawlStrategy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field(() => Int)
  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  pickkDiscountRate: number;
}
