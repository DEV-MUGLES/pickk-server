import { IBaseId } from '@common/interfaces';

import { ILook } from '@content/looks/interfaces';

import { IKeyword } from './keyword.interface';

export interface IKeywordLook extends IBaseId {
  keyword: IKeyword;
  keywordId: number;

  look: ILook;
  lookId: number;

  order: number;
}
