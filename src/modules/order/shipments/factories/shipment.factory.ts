import { ShipmentStatus } from '../constants';
import { Shipment } from '../models';

export class ShipmentFactory {
  static create(
    input: Pick<Shipment, 'ownerType' | 'ownerPk' | 'courierId' | 'trackCode'>
  ): Shipment {
    return new Shipment({
      status: ShipmentStatus.Shipping,
      ...input,
    });
  }
}
