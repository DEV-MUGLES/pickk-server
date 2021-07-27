import { PartialType } from '@nestjs/mapped-types';

import { PaymentEntity } from '../entities';

export class UpdatePaymentDto extends PartialType(PaymentEntity) {}
