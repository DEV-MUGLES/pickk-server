import { url2key } from '@common/helpers';

import { DigestImage } from '../models';

export class DigestImageFactory {
  static from(url: string, order: number, digestId?: number) {
    return new DigestImage({ key: url2key(url), order, digestId });
  }
}
