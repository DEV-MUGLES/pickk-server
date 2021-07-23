import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

@ObjectType()
@Entity({ name: 'order_refund_account' })
export class OrderRefundAccountEntity extends AbstractAccountEntity {}
