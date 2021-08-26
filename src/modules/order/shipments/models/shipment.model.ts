import { Field, ObjectType } from '@nestjs/graphql';

import { ShipmentEntity } from '../entities';

import { ShipmentHistory } from './shipment-history.model';

@ObjectType()
export class Shipment extends ShipmentEntity {
  @Field(() => [ShipmentHistory])
  shipmentHistories: ShipmentHistory[];
}
