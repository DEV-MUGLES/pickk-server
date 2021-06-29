import { IPointEvent } from '../interfaces/point-event.interface';

export type SubtractPointEventInput = Pick<
  IPointEvent,
  'userId' | 'orderId' | 'orderItemId' | 'title' | 'content' | 'amount'
>;
