import { ICourier } from '@item/couriers/interfaces';

import { ShipmentOwnerType, ShipmentStatus } from '../constants';

export interface IShipment {
  id: number;
  createdAt: Date;

  status: ShipmentStatus;
  ownerType: ShipmentOwnerType;
  ownerId: number;

  courier: ICourier;
  courierId: number;
  trackCode: string;

  lastTrackedAt: Date;
}
