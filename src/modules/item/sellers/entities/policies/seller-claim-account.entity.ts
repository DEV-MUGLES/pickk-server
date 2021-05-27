import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@src/common/entities/account.entity';

@ObjectType()
@Entity('seller_claim_account')
export class SellerClaimAccountEntity extends AbstractAccountEntity {}
