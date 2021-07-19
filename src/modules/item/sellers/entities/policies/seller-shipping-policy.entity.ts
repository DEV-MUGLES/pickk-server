import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsNumber, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISellerShippingPolicy } from '../../interfaces';

@ObjectType()
@Entity('seller_shipping_policy')
export class SellerShippingPolicyEntity
  extends BaseIdEntity
  implements ISellerShippingPolicy
{
  constructor(attributes?: Partial<SellerShippingPolicyEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.minimumAmountForFree = attributes.minimumAmountForFree;
    this.fee = attributes.fee;
  }

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @IsNumber()
  @Min(0)
  minimumAmountForFree: number;

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @IsNumber()
  @Min(0)
  fee: number;
}
