import { ObjectType } from '@nestjs/graphql';

import { SaleStrategyEntity } from '../entities';

@ObjectType()
export class SaleStrategy extends SaleStrategyEntity {
  constructor(attributes?: Partial<SaleStrategyEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.canUseCoupon = attributes.canUseCoupon;
    this.canUseMileage = attributes.canUseMileage;
  }
}
