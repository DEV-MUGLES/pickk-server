import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { IUser } from '@user/users/interfaces';

export interface IVideo extends IBaseId {
  user: IUser;
  userId: number;

  digests: IDigest[];

  youtubeCode: string;
  youtubeDuration: number;
  youtubeViewCount: number;
  title: string;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;

  // model only fields
  isLiking: boolean;
  isMine: boolean;
}
