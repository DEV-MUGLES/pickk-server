import { registerEnumType } from '@nestjs/graphql';

export enum HitOwnerType {
  Digest = 'Digest',
  Look = 'Look',
  Video = 'Video',
  Item = 'Item',
  Keyword = 'Keyword',
}

registerEnumType(HitOwnerType, {
  name: 'HitOwnerType',
  description: '조회수 누적 대상 객체 분류입니다.',
});
