import { IImage } from '@common/interfaces';

import { IDigest } from './digest.interface';

export interface IDigestImage extends IImage {
  digest: IDigest;
  digestId: number;
}
