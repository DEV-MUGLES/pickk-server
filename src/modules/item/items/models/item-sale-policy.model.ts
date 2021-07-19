import { ObjectType } from '@nestjs/graphql';

import { ItemSalePolicyEntity } from '../entities';

@ObjectType()
export class ItemSalePolicy extends ItemSalePolicyEntity {}
