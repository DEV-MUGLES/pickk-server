import { parseToImageKey } from '@common/helpers';

import { DigestImage } from '../models';

export class DigestImageFactory {
  static from(url: string, order: number) {
    return new DigestImage({ key: parseToImageKey(url), order });
  }
}
