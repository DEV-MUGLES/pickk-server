import { Payment } from '../models';

export type PaymentRelationType = keyof Payment;

export const PAYMENT_RELATIONS: Array<PaymentRelationType> = ['cancellations'];
