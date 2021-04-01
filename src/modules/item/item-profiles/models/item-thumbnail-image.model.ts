import { ObjectType } from '@nestjs/graphql';

import { AbstractImageEntity } from '@src/common/entities/image.entity';

@ObjectType()
export class ItemThumbnailImage extends AbstractImageEntity {}
