import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractAddressEntity } from '@common/entities';

import { ISeller, ISellerReturnAddress } from '../interfaces';

@ObjectType()
@Entity('seller_return_address')
export class SellerReturnAddressEntity
  extends AbstractAddressEntity
  implements ISellerReturnAddress
{
  constructor(attributes?: Partial<SellerReturnAddressEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
  }

  @OneToOne('SellerEntity', 'returnAddress', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;
}
