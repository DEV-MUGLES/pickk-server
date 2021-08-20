import { HitOwnerType } from '../constants';

export const getEarlyHitCacheKey = (
  ownerType: HitOwnerType,
  ownerId: number,
  ipOrId: string
) => `h-${ownerType}:${ownerId}:${ipOrId}`;

export const getCountMapCacheKey = (ownerType: HitOwnerType) =>
  `hcm-${ownerType}`;
