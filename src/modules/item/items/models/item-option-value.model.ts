import { ObjectType } from '@nestjs/graphql';

// @TODO:BARREL
import { ItemOptionValueEntity } from '../entities/item-option-value.entity';

@ObjectType()
export class ItemOptionValue extends ItemOptionValueEntity {}
