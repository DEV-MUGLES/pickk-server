import { IImage } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { IStyleTag } from '@content/style-tags/interfaces';
import { IUser } from '@user/users/interfaces';

export interface ILook {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  styleTags: IStyleTag[];
  images: IImage[];
  digests: IDigest[];

  title: string;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;

  isLiking: boolean;
  isMine: boolean;
}
