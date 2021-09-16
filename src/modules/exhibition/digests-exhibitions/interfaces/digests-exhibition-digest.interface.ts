import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';

import { IDigestsExhibition } from './digests-exhibition.interface';

export interface IDigestsExhibitionDigest extends IBaseId {
  exhibition: IDigestsExhibition;
  exhibitionId: number;

  digest: IDigest;
  digestId: number;

  order: number;
}
