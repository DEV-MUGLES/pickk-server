import { Digest } from '../models';

import { DigestImageFactory } from './digest-image.factory';

export class DigestFactory {
  static from(attrs: Partial<Digest>, imageUrls?: string[]) {
    return new Digest({
      ...attrs,
      images:
        imageUrls?.map((url, index) => DigestImageFactory.from(url, index)) ??
        [],
    });
  }
}
