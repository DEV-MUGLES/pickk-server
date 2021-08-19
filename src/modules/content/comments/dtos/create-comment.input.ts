import { InputType, PickType } from '@nestjs/graphql';

import { Comment } from '../models';

@InputType()
export class CreateCommentInput extends PickType(
  Comment,
  ['ownerType', 'ownerId', 'parentId', 'mentionedUserId', 'content'],
  InputType
) {}
