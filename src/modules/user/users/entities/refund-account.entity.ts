import { ObjectType } from '@nestjs/graphql';
import { Entity, OneToOne } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import { IRefundAccount, IUser } from '../interfaces';

@ObjectType()
@Entity({ name: 'refund_account' })
export class RefundAccountEntity
  extends AbstractAccountEntity
  implements IRefundAccount
{
  constructor(attributes?: Partial<RefundAccountEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
  }

  @OneToOne('UserEntity', 'refundAccount', { onDelete: 'CASCADE' })
  user: IUser;
}
