import { ObjectType } from '@nestjs/graphql';

import { ShipmentEntity } from '../entities';

@ObjectType()
export class Shipment extends ShipmentEntity {}
