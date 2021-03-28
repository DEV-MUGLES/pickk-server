import { ObjectType } from '@nestjs/graphql';
import { SellerEntity } from '../entities/seller.entity';

@ObjectType()
export class Seller extends SellerEntity {
  constructor(attributes?: Partial<SellerEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.businessName = attributes.businessName;
    this.businessCode = attributes.businessCode;
    this.mailOrderBusinessCode = attributes.mailOrderBusinessCode;
    this.representativeName = attributes.representativeName;
    this.phoneNumber = attributes.phoneNumber;
    this.email = attributes.email;
    this.kakaoTalkCode = attributes.kakaoTalkCode;
    this.operationTimeMessage = attributes.operationTimeMessage;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;

    this.saleStrategy = attributes.saleStrategy;
  }
}
