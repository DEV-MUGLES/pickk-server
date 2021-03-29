import { ObjectType } from '@nestjs/graphql';

import { SellerReturnAddressEntity } from '../entities/seller-return-address.entity';

@ObjectType()
export class SellerReturnAddress extends SellerReturnAddressEntity {}
