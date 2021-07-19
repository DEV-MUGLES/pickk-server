import { ObjectType } from '@nestjs/graphql';

import { ItemSalePolicyEntity } from '../entities/item-sale-policy.entity';

@ObjectType()
export class ItemSalePolicy extends ItemSalePolicyEntity {}
