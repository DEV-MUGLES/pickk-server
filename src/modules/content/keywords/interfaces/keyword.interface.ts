import { IDigest } from '@content/digests/interfaces';
import { ILook } from '@content/looks/interfaces';
import { IStyleTag } from '@content/style-tags/interfaces';
import { IKeywordClass } from './keyword-class.interface';
import { IKeywordMatchTag } from './keyword-match-tag.interface';

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

  styleTags: IStyleTag[];
  looks: ILook[];
  digests: IDigest[];

  relatedKeywords: IKeyword[];
  matchTags: IKeywordMatchTag[];
  classes: IKeywordClass[];

  likeCount: number;
  hitCount: number;
  score: number;

  // model-only field
  isOwning: boolean;
  isLiking: boolean;
}
