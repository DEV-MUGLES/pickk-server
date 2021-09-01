import { IImage } from '@common/interfaces';

import { ILook } from '@content/looks/interfaces';
import { IVideo } from '@content/videos/interfaces';
import { IItemPropertyValue } from '@item/item-properties/interfaces';
import { IItem } from '@item/items/interfaces';
import { IUser } from '@user/users/interfaces';

export interface IDigest {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  item: IItem;
  itemId: number;
  user: IUser;
  userId: number;

  video: IVideo;
  videoId: number;
  look: ILook;
  lookId: number;

  itemPropertyValues: IItemPropertyValue[];
  images: IImage[];

  /** 착용 사이즈 */
  size: string;

  // 여기부터 꿀템만 있는 값들
  rating: number;
  title: string;
  content: string;
  timestampStartSecond: number;
  timestampEndSecond: number;

  likeCount: number;
  hitCount: number;
  commentCount: number;
  score: number;
  /** score를 계산하기위한 값입니다. 오직 score를 계산할 경우에만 사용됩니다.*/
  likeCommentOrderScore: number;
  // model only fields
  isLiking: boolean;
  isMine: boolean;
}
