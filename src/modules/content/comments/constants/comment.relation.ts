import { Comment } from '../models';

export type CommentRelationType =
  | keyof Comment
  | 'parent.user'
  | 'replies.user'
  | 'replies.mentionedUser';

export const COMMENT_RELATIONS: CommentRelationType[] = [
  'user',
  'parent',
  'parent.user',
  'replies',
  'replies.user',
  'replies.mentionedUser',
  'mentionedUser',
];
