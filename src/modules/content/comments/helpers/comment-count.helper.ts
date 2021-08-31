import { CommentOwnerType } from '../constants';

export const getCommentCountCacheKey = (
  ownerType: CommentOwnerType,
  ownerId: number
): string => `${ownerType}:${ownerId}:comments-count`;
