import { ObjectType } from '@nestjs/graphql';

import { ItemPriceEntity } from '../entities';

@ObjectType()
export class ItemPrice extends ItemPriceEntity {}
