import { ObjectType } from '@nestjs/graphql';
import { SellerShippingPolicyEntity } from '../../entities/policies/seller-shipping-policy.entity';

@ObjectType()
export class SellerShippingPolicy extends SellerShippingPolicyEntity {}
