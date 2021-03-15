import { ObjectType } from '@nestjs/graphql';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';

@ObjectType()
export class ShippingAddress extends ShippingAddressEntity {
  constructor(attributes?: Partial<ShippingAddressEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.name = attributes.name;
  }
}
