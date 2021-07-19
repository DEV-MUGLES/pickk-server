import { ObjectType } from '@nestjs/graphql';

import { ItemDetailImageEntity } from '../entities';

@ObjectType()
export class ItemDetailImage extends ItemDetailImageEntity {}
