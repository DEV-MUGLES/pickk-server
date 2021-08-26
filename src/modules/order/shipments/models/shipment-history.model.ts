import { ObjectType } from '@nestjs/graphql';

import { ShipmentHistoryEntity } from '../entities';

@ObjectType()
export class ShipmentHistory extends ShipmentHistoryEntity {}
