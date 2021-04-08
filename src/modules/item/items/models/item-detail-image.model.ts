import { ObjectType } from '@nestjs/graphql';

import { ItemDetailImageEntity } from '../entities/item-detail-image.entity';

@ObjectType()
export class ItemDetailImage extends ItemDetailImageEntity {}
