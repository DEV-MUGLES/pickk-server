import { ObjectType } from '@nestjs/graphql';
import { AbstractAddressEntity } from '@src/common/entities/address.entity';
import { Entity } from 'typeorm';

@ObjectType()
@Entity('seller_return_address')
export class SellerReturnAddressEntity extends AbstractAddressEntity {}
