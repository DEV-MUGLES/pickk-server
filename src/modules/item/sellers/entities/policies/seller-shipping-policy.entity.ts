import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISeller, ISellerShippingPolicy } from '../../interfaces';

@ObjectType()
@Entity('seller_shipping_policy')
export class SellerShippingPolicyEntity
  extends BaseIdEntity
  implements ISellerShippingPolicy
{
  constructor(attributes?: Partial<SellerShippingPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.minimumAmountForFree = attributes.minimumAmountForFree;
    this.fee = attributes.fee;
    this.description = attributes.description;
  }

  @OneToOne('SellerEntity', 'shippingPolicy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @Min(0)
  minimumAmountForFree: number;
  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @Min(0)
  fee: number;
  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  description: string;
}
