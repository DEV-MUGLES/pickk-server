import { InputType, PickType } from '@nestjs/graphql';

import { Comment } from '../models';

@InputType()
export class UpdateCommentInput extends PickType(
  Comment,
  ['content'],
  InputType
) {}
