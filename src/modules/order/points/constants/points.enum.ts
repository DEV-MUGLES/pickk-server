import { registerEnumType } from '@nestjs/graphql';

export enum PointType {
  ADD = 'ADD',
  SUB = 'SUB',
}

registerEnumType(PointType, {
  name: 'PointType',
  description: '포인트 분류입니다. 적립(ADD), 사용(SUB)',
});
