import { Comment } from '../models';

export type CommentRelationType =
  | keyof Comment
  | 'parent.user'
  | 'replies.user';

export const COMMENT_RELATIONS: CommentRelationType[] = [
  'user',
  'parent',
  'parent.user',
  'replies',
  'replies.user',
  'mentionedUser',
];
