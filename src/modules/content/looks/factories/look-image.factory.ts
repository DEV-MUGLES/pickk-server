import { url2key } from '@common/helpers';

import { LookImage } from '../models';

export class LookImageFactory {
  static from(url: string, order: number) {
    return new LookImage({ key: url2key(url), order });
  }
}
