import { registerEnumType } from '@nestjs/graphql';

export enum PointType {
  Add = 'Add',
  Sub = 'Sub',
}

registerEnumType(PointType, {
  name: 'PointType',
  description: '포인트 분류입니다. 적립(Add), 사용(Sub)',
});
