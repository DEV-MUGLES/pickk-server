import { ObjectType } from '@nestjs/graphql';

import { ShippingAddressEntity } from '../entities';

@ObjectType()
export class ShippingAddress extends ShippingAddressEntity {
  constructor(attributes?: Partial<ShippingAddressEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.name = attributes.name;
    this.receiverName = attributes.receiverName;

    this.baseAddress = attributes.baseAddress;
    this.detailAddress = attributes.detailAddress;
    this.postalCode = attributes.postalCode;
    this.phoneNumber1 = attributes.phoneNumber1;
    this.phoneNumber2 = attributes.phoneNumber2;
    this.isPrimary = attributes.isPrimary;

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
  }
}
