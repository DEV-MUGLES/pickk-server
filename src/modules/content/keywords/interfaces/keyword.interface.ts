import { IBaseId } from '@common/interfaces';

import { IStyleTag } from '@content/style-tags/interfaces';

import { IKeywordClass } from './keyword-class.interface';
import { IKeywordDigest } from './keyword-digest.interface';
import { IKeywordLook } from './keyword-look.interface';

export interface IKeyword extends IBaseId {
  classes: IKeywordClass[];

  styleTags: IStyleTag[];
  keywordLooks: IKeywordLook[];
  keywordDigests: IKeywordDigest[];
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
