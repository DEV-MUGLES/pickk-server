import { ObjectType } from '@nestjs/graphql';
import { AbstractAddressEntity } from '@common/entities';
import { Entity } from 'typeorm';

@ObjectType()
@Entity('seller_return_address')
export class SellerReturnAddressEntity extends AbstractAddressEntity {}
