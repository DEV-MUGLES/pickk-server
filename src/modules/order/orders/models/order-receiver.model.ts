import { ObjectType } from '@nestjs/graphql';

import { OrderReceiverEntity } from '../entities';

@ObjectType()
export class OrderReceiver extends OrderReceiverEntity {}
