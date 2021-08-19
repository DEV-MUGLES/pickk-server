import { User } from '../models';

export type UserRelationType = keyof User;

export const USER_RELATIONS: UserRelationType[] = [
  'styleTags',
  'shippingAddresses',
  'refundAccount',
];
