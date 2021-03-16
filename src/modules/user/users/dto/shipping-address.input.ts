import {
  InputType,
  PartialType,
  PickType,
  OmitType,
  Field,
} from '@nestjs/graphql';
import { ShippingAddress } from '../models/shipping-address.model';

@InputType()
export class CreateShippingAddressInput extends PickType(
  ShippingAddress,
  [
    'name',
    'receiverName',
    'baseAddress',
    'detailAddress',
    'postalCode',
    'phoneNumber1',
    'phoneNumber2',
    'isPrimary',
  ],
  InputType
) {}

@InputType()
export class UpdateShippingAddressInput extends PartialType(
  OmitType(ShippingAddress, ['id', 'createdAt', 'updatedAt'], InputType)
) {}
