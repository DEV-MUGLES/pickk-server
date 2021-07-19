import { ObjectType } from '@nestjs/graphql';

import { ItemNoticeEntity } from '../entities';

@ObjectType()
export class ItemNotice extends ItemNoticeEntity {}
