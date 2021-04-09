import { ObjectType } from '@nestjs/graphql';

import { ProductShippingReservePolicyEntity } from '../entities/product-shipping-reserve-policy.entity';

@ObjectType()
export class ProductShippingReservePolicy extends ProductShippingReservePolicyEntity {}
