import { IBaseId } from '@common/interfaces';

import { IUser } from '@user/users/interfaces';

import { CommentOwnerType } from '../constants';

export interface IComment extends IBaseId {
  user: IUser;
  userId: number;

  parent: IComment;
  parentId: number;
  replies: IComment[];
  mentionedUser: IUser;
  mentionedUserId: number;

  ownerType: CommentOwnerType;
  ownerId: number;

  content: string;
  isContentUpdated: boolean;
  isDeleted: boolean;

  contentUpdatedAt: Date;

  likeCount: number;

  // model-only fields
  isLiking: boolean;
  isMine: boolean;
}
