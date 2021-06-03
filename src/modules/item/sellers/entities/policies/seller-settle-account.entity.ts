import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@src/common/entities/account.entity';

@ObjectType()
@Entity('seller_settle_account')
export class SellerSettleAccountEntity extends AbstractAccountEntity {}
