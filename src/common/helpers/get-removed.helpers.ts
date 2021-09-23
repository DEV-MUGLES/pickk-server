import { Digest } from '@content/digests/models';

import { findModelById } from './model.helpers';

export const getRemovedDigests = <Model extends { digests: Digest[] }>(
  original: Model,
  updated: Model
): Digest[] => {
  return original.digests.filter((v) => !findModelById(v.id, updated.digests));
};

export const getRemovedImages = <
  Model extends { images: ImageModel[] },
  ImageModel extends { key: string }
>(
  original: Model,
  updated: Model
): ImageModel[] => {
  return original.images.filter(
    (v) => !updated.images.find(({ key }) => v.key === key)
  );
};
