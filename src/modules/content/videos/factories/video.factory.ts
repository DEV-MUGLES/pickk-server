import { findModelsByIds } from '@common/helpers';

import { DigestFactory } from '@content/digests/factories';
import { ItemPropertyValue } from '@item/item-properties/models';

import { CreateVideoInput } from '../dtos';
import { Video } from '../models';

export class VideoFactory {
  static from(
    userId: number,
    input: CreateVideoInput,
    itemPropertyValues: ItemPropertyValue[]
  ): Video {
    return new Video({
      userId,
      ...input,
      digests: input.digests.map((digest) =>
        DigestFactory.from({
          userId,
          ...digest,
          itemPropertyValues: findModelsByIds(
            digest.itemPropertyValueIds,
            itemPropertyValues
          ),
        })
      ),
    });
  }
}
