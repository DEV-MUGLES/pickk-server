import { ObjectType } from '@nestjs/graphql';
import { SellerEntity } from '../entities/seller.entity';

@ObjectType()
export class Seller extends SellerEntity {}
