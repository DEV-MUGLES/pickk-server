import { registerEnumType } from '@nestjs/graphql';

export enum HitOwnerType {
  DIGEST = 'DIGEST',
  LOOK = 'LOOK',
  VIDEO = 'VIDEO',
  ITEM = 'ITEM',
  KEYWORD = 'KEYWORD',
}

registerEnumType(HitOwnerType, {
  name: 'HitOwnerType',
  description: '조회수 누적 대상 객체 분류입니다.',
});
