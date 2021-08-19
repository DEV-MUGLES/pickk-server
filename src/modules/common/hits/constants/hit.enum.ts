import { registerEnumType } from '@nestjs/graphql';

export enum HitOwnerType {
  Digest = 'digest',
  Look = 'look',
  Video = 'video',
  Item = 'item',
  Keyword = 'keyword',
}

registerEnumType(HitOwnerType, {
  name: 'HitOwnerType',
  description: '조회수 누적 대상 객체 분류입니다.',
});
