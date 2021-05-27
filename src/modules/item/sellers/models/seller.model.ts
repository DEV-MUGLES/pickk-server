import { ObjectType } from '@nestjs/graphql';
import { SellerEntity } from '../entities/seller.entity';

@ObjectType()
export class Seller extends SellerEntity {
  constructor(attributes?: Partial<SellerEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.businessName = attributes.businessName;
    this.businessCode = attributes.businessCode;
    this.mailOrderBusinessCode = attributes.mailOrderBusinessCode;
    this.representativeName = attributes.representativeName;
    this.email = attributes.email;

    this.orderNotiPhoneNumber = attributes.orderNotiPhoneNumber;
    this.csNotiPhoneNumber = attributes.csNotiPhoneNumber;

    this.phoneNumber = attributes.phoneNumber;
    this.operationTimeMessage = attributes.operationTimeMessage;
    this.kakaoTalkCode = attributes.kakaoTalkCode;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;
    this.courier = attributes.courier;
    this.courierId = attributes.courierId;

    this.saleStrategy = attributes.saleStrategy;
    this.claimPolicy = attributes.claimPolicy;
    this.crawlPolicy = attributes.crawlPolicy;
    this.shippingPolicy = attributes.shippingPolicy;

    this.returnAddress = attributes.returnAddress;
  }
}
