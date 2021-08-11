import { InputType, PickType } from '@nestjs/graphql';

import { Shipment } from '../models';

@InputType()
export class CreateShipmentInput extends PickType(
  Shipment,
  ['courierId', 'trackCode'],
  InputType
) {}
