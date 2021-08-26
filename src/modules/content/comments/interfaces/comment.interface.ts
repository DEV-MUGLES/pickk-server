import { IUser } from '@user/users/interfaces';

import { CommentOwnerType } from '../constants';

export interface IComment {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  ownerType: CommentOwnerType;
  ownerId: number;

  parent: IComment;
  parentId: number;

  mentionedUser: IUser;
  mentionedUserId: number;

  content: string;
  isContentUpdated: boolean;
  isDeleted: boolean;

  contentUpdatedAt: Date;

  likeCount: number;

  // model-only fields
  isLiking: boolean;
  isMine: boolean;
}
