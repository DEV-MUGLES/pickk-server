import { InputType, PartialType, PickType, OmitType } from '@nestjs/graphql';

import { ShippingAddress } from '../models';

@InputType()
export class CreateShippingAddressInput extends PickType(
  ShippingAddress,
  [
    'name',
    'receiverName',
    'phoneNumber',
    'baseAddress',
    'detailAddress',
    'postalCode',
    'isPrimary',
  ],
  InputType
) {}

@InputType()
export class UpdateShippingAddressInput extends PartialType(
  OmitType(ShippingAddress, ['id', 'createdAt', 'updatedAt'], InputType)
) {}
