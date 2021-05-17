import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { ItemNotice } from '../models/item-notice.model';

@InputType()
export class AddItemNoticeInput extends PickType(
  ItemNotice,
  ['type', 'message', 'startAt', 'endAt'],
  InputType
) {}

@InputType()
export class UpdateItemNoticeInput extends PartialType(AddItemNoticeInput) {}
