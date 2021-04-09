import { ObjectType } from '@nestjs/graphql';

import { ItemOptionValueEntity } from '../entities/item-option-value.entity';

@ObjectType()
export class ItemOptionValue extends ItemOptionValueEntity {}
