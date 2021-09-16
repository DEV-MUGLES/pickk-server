import { IBaseId } from '@common/interfaces';

import { IDigestsExhibitionDigest } from './digests-exhibition-digest.interface';

export interface IDigestsExhibition extends IBaseId {
  exhibitionDigests: IDigestsExhibitionDigest[];
}
