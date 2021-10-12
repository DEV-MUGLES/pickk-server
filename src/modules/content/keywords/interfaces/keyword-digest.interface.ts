import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';

import { IKeyword } from './keyword.interface';

export interface IKeywordDigest extends IBaseId {
  keyword: IKeyword;
  keywordId: number;

  digest: IDigest;
  digestId: number;

  order: number;
}
