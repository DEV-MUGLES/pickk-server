import { Field, InputType } from '@nestjs/graphql';

import { ISeller } from '../interfaces/seller.interface';
import { Seller } from '../models';

@InputType()
export class SellerFilter implements Partial<ISeller> {
  searchFields: Array<keyof Seller> = ['businessCode', 'businessName', 'id'];

  @Field({ nullable: true })
  businessCode: string;

  @Field(() => [String], { nullable: true })
  kakaoTalkCodeIn: string[];

  @Field({ nullable: true })
  search: string;
}
