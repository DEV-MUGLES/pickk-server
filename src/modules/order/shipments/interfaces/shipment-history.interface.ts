import { IShipment } from './shipment.interface';

export interface IShipmentHistory {
  id: number;
  createdAt: Date;

  statusText: string;
  locationName: string;
  time: Date;

  shipment: IShipment;
  shipmentId: number;
}
