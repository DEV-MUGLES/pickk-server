import { InputType, PickType } from '@nestjs/graphql';
import { Shipment } from '@order/shipments/models';

@InputType()
export class ShipOrderItemInput extends PickType(
  Shipment,
  ['courierId', 'trackCode'],
  InputType
) {}
