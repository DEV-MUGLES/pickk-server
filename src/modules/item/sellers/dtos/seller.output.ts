import { ObjectType, PickType } from '@nestjs/graphql';

import { Seller } from '../models/seller.model';

@ObjectType()
export class BaseSellerOutput extends PickType(Seller, [
  'businessName',
  'businessCode',
  'mailOrderBusinessCode',
  'representativeName',
  'phoneNumber',
  'email',
  'kakaoTalkCode',
  'operationTimeMessage',
]) {}
