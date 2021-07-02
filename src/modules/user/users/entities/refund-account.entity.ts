import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@src/common/entities/account.entity';

@ObjectType()
@Entity({ name: 'refund_account' })
export class RefundAccountEntity extends AbstractAccountEntity {}
