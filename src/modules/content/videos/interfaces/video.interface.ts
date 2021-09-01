import { IDigest } from '@content/digests/interfaces';
import { IUser } from '@user/users/interfaces';

export interface IVideo {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  digests: IDigest[];

  youtubeCode: string;
  title: string;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;
  /** score를 계산하기위한 값입니다. 오직 score를 계산할 경우에만 사용됩니다.*/
  likeCommentScore: number;

  // model only fields
  isLiking: boolean;
  isMine: boolean;
}
