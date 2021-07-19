import { ObjectType } from '@nestjs/graphql';

import { ProductShippingReservePolicyEntity } from '../entities';

@ObjectType()
export class ProductShippingReservePolicy extends ProductShippingReservePolicyEntity {}
