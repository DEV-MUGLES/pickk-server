import { DigestFactory } from '@content/digests/factories';
import { StyleTag } from '@content/style-tags/models';

import { CreateLookInput } from '../dtos';
import { Look } from '../models';

import { LookImageFactory } from './look-image.factory';

export class LookFactory {
  static from(
    userId: number,
    input: CreateLookInput,
    styleTags: StyleTag[]
  ): Look {
    return new Look({
      userId,
      ...input,
      styleTags,
      images: input.imageUrls.map((url, index) =>
        LookImageFactory.from(url, index)
      ),
      digests: input.digests.map((digest) =>
        DigestFactory.from({ ...digest, userId })
      ),
    });
  }
}
