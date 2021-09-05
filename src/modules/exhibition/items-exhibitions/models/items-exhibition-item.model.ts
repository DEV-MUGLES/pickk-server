import { ObjectType } from '@nestjs/graphql';

import { ItemsExhibitionItemEntity } from '../entities/items-exhibition-item.entity';

@ObjectType()
export class ItemsExhibitionItem extends ItemsExhibitionItemEntity {}
