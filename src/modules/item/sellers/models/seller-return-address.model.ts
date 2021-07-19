import { ObjectType } from '@nestjs/graphql';

import { SellerReturnAddressEntity } from '../entities';

@ObjectType()
export class SellerReturnAddress extends SellerReturnAddressEntity {}
