import { IDigest } from '@content/digests/interfaces';

import { IDigestsExhibition } from './digests-exhibition.interface';

export interface IDigestsExhibitionDigest {
  exhibition: IDigestsExhibition;
  exhibitionId: number;

  digest: IDigest;
  digestId: number;

  order: number;
}
