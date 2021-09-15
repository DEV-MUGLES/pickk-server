import { ObjectType } from '@nestjs/graphql';

import { ItemsPackageItemEntity } from '../entities/items-package-item.entity';

@ObjectType()
export class ItemsPackageItem extends ItemsPackageItemEntity {}
