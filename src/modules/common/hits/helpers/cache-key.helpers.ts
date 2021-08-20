import { HitOwnerType } from '../constants';

export const getEarlyHitCacheKey = (
  ownerType: HitOwnerType,
  ownerId: number,
  ipOrId: string
) => `hit:${ownerType}-${ownerId}-${ipOrId}`;

export const getCountMapCacheKey = (ownerType: HitOwnerType) =>
  `hit-count-map:${ownerType}`;
