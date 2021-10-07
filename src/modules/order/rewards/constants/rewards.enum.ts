import { registerEnumType } from '@nestjs/graphql';

export enum RewardSign {
  Plus = 'Plus',
  Minus = 'Minus',
}

registerEnumType(RewardSign, {
  name: 'RewardSign',
  description: '적립(Plus), 사용(Minus)',
});
