import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

@ObjectType()
@Entity('seller_claim_account')
export class SellerClaimAccountEntity extends AbstractAccountEntity {}
