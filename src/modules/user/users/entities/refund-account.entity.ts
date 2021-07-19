import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

@ObjectType()
@Entity({ name: 'refund_account' })
export class RefundAccountEntity extends AbstractAccountEntity {}
