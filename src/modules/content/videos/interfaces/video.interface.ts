import { IComment } from '@content/comments/interfaces';
import { IDigest } from '@content/digests/interfaces';
import { IUser } from '@user/users/interfaces';

export interface IVideo {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  digests: IDigest[];
  comments: IComment[];

  youtubeCode: string;
  title: string;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;
}
