import { ExpectedPointEvent } from '../models';

export type AddExpectedPointEventInput = Pick<
  ExpectedPointEvent,
  'amount' | 'title' | 'orderId' | 'content' | 'userId'
>;
