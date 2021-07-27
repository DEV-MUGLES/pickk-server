import { registerEnumType } from '@nestjs/graphql';

export enum PaymentCancellationType {
  Cancel = 'cancel',
  PatialCancel = 'partial_cancel',
}

registerEnumType(PaymentCancellationType, {
  name: 'PaymentCancellationType',
});
