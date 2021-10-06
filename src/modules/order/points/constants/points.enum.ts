import { registerEnumType } from '@nestjs/graphql';

export enum PointSign {
  Plus = 'Plus',
  Minus = 'Minus',
}

registerEnumType(PointSign, {
  name: 'PointSign',
  description: '포인트 분류입니다. 적립(Plus), 사용(Minus)',
});
