import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { AbstractAddressEntity } from '@common/entities';

@ObjectType()
@Entity('seller_return_address')
export class SellerReturnAddressEntity extends AbstractAddressEntity {}
