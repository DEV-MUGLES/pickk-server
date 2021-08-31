import { ObjectType } from '@nestjs/graphql';

import { ShippingAddress } from '@user/users/models';

import { OrderReceiverEntity } from '../entities';

@ObjectType()
export class OrderReceiver extends OrderReceiverEntity {
  static from(
    shippingAddress: ShippingAddress,
    message: string
  ): OrderReceiver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...receiverInput } = shippingAddress;

    return new OrderReceiver({
      ...receiverInput,
      message,
    });
  }
}
