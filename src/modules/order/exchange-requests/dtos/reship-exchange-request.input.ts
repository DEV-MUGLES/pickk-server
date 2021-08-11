import { InputType, PickType } from '@nestjs/graphql';

import { Shipment } from '@order/shipments/models';

@InputType()
export class ReshipExchangeRequestInput extends PickType(
  Shipment,
  ['courierId', 'trackCode'],
  InputType
) {}
