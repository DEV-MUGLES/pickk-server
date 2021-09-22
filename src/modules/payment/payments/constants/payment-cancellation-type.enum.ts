import { registerEnumType } from '@nestjs/graphql';

export enum PaymentCancellationType {
  Cancel = 'Cancel',
  PartialCancel = 'PartialCancel',
}

registerEnumType(PaymentCancellationType, {
  name: 'PaymentCancellationType',
});
