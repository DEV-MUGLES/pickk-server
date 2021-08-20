import { PickType } from '@nestjs/mapped-types';

import { Comment } from '../models';

export class UpdateCommentLikeCountDto extends PickType(Comment, [
  'likeCount',
]) {}
