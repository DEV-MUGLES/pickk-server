import { ObjectType } from '@nestjs/graphql';

import { ItemNoticeEntity } from '../entities/item-notice.entity';

@ObjectType()
export class ItemNotice extends ItemNoticeEntity {}
