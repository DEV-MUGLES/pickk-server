import { ExchangeRequest } from '../models';

export type ExchangeRequestRelationType =
  | keyof ExchangeRequest
  | 'orderItem.order'
  | 'orderItem.order.buyer'
  | 'orderItem.order.receiver'
  | 'pickShipment.courier'
  | 'reShipment.courier';

export const EXCHANGE_REQUEST_RELATIONS: Array<ExchangeRequestRelationType> = [
  'user',
  'orderItem',
  'orderItem.order',
  'orderItem.order.buyer',
  'orderItem.order.receiver',
  'pickShipment',
  'pickShipment.courier',
  'reShipment',
  'reShipment.courier',
];
