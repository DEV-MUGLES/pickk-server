import { ObjectType } from '@nestjs/graphql';
import { CourierEntity } from '../entities/courier.entity';

@ObjectType()
export class Courier extends CourierEntity {
  constructor(attributes?: Partial<Courier>) {
    super();
    if (!attributes) {
      return;
    }
    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.name = attributes.name;
    this.code = attributes.code;
    this.phoneNumber = attributes.phoneNumber;
    this.returnReserveUrl = attributes.returnReserveUrl;
  }
}
