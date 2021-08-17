import { IImage } from '@common/interfaces';

import { IComment } from '@content/comments/interfaces';
import { IDigest } from '@content/digests/interfaces';
import { IUser } from '@user/users/interfaces';

import { ILookStyleTag } from './look-style-tag.interface';

export interface ILook {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  styleTags: ILookStyleTag[];
  images: IImage[];
  digests: IDigest[];
  comments: IComment[];
  title: string;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;
}
