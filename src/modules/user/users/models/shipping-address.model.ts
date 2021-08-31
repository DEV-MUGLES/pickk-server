import { ObjectType } from '@nestjs/graphql';

import { ShippingAddressEntity } from '../entities';

@ObjectType()
export class ShippingAddress extends ShippingAddressEntity {}
