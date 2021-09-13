import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { ISaleStrategy } from '../interfaces';

import { BaseIdEntity } from './base.entity';

@ObjectType()
@Entity('sale_strategy')
export class SaleStrategyEntity extends BaseIdEntity implements ISaleStrategy {
  constructor(attributes?: Partial<SaleStrategyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.canUseCoupon = attributes.canUseCoupon;
    this.canUseMileage = attributes.canUseMileage;
  }

  @Field()
  @Column()
  canUseCoupon: boolean;

  @Field()
  @Column()
  canUseMileage: boolean;
}
