import { IDigest } from '@content/digests/interfaces';
import { ILook } from '@content/looks/interfaces';
import { IStyleTag } from '@content/style-tags/interfaces';
import { IKeywordClass } from './keyword-class.interface';

export interface IKeyword {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  imageUrl: string;
  content: string;
  stylingTip: string;
  usablityRate: number;
  isVisible: boolean;

  _matchTagNames: string;

  styleTags: IStyleTag[];
  looks: ILook[];
  digests: IDigest[];

  relatedKeywords: IKeyword[];
  classes: IKeywordClass[];

  likeCount: number;
  hitCount: number;
  score: number;

  // model-only field
  isOwning: boolean;
  isLiking: boolean;
}
