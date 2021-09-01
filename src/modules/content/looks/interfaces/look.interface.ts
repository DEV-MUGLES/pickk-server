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
  /** score를 계산하기위한 값입니다. 오직 score를 계산할 경우에만 사용됩니다.*/
  likeCommentScore: number;

  isLiking: boolean;
  isMine: boolean;
}
