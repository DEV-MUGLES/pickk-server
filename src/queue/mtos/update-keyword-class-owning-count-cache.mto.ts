export enum UpdateKeywordClassOwningCountCacheType {
  Increase = 'increase',
  Decrease = 'decrease',
}

export class UpdateKeywordClassOwningCountCacheMto {
  userId: number;
  keywordId: number;
  type: UpdateKeywordClassOwningCountCacheType;
}
