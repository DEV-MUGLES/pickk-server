import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsNumber, Min } from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { ISellerShippingPolicy } from '../../interfaces/policies';

@ObjectType()
@Entity('seller_shipping_policy')
export class SellerShippingPolicyEntity
  extends BaseEntity
  implements ISellerShippingPolicy {
  constructor(attributes?: Partial<BaseEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
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
