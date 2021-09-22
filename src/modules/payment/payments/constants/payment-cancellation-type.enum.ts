import { registerEnumType } from '@nestjs/graphql';

export enum PaymentCancellationType {
  CANCEL = 'CANCEL',
  PARTIAL_CANCEL = 'PARTIAL_CANCEL',
}

registerEnumType(PaymentCancellationType, {
  name: 'PaymentCancellationType',
});
