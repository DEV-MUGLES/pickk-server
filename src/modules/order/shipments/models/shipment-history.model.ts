import { ObjectType } from '@nestjs/graphql';
import dayjs from 'dayjs';

import { ShipmentHistoryEntity } from '../entities';

@ObjectType()
export class ShipmentHistory extends ShipmentHistoryEntity {
  isEqual(shipmentHistory: ShipmentHistory) {
    return (
      this.locationName === shipmentHistory.locationName &&
      this.statusText === shipmentHistory.statusText &&
      dayjs(this.time).isSame(shipmentHistory.time)
    );
  }
}
