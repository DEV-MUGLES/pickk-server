import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { ILook } from '@content/looks/interfaces';
import { IStyleTag } from '@content/style-tags/interfaces';

import { IKeywordClass } from './keyword-class.interface';

export interface IKeyword extends IBaseId {
  classes: IKeywordClass[];

  styleTags: IStyleTag[];
  looks: ILook[];
  digests: IDigest[];
  relatedKeywords: IKeyword[];

  name: string;
  imageUrl: string;
  content: string;
  stylingTip: string;
  usablityRate: number;

  isVisible: boolean;

  _matchTagNames: string;

  likeCount: number;
  hitCount: number;
  score: number;

  // model-only field
  isOwning: boolean;
  isLiking: boolean;
}
