import { AlimtalkMessageRequest } from 'nest-sens';

import { ISellerInfo } from './intefaces';

export class OrdersCreatedTemplate {
  static code = 'Baccept04';

  static toRequest(
    sellerInfo: ISellerInfo,
    orderCount: number
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const { phoneNumber, brandKor } = sellerInfo;
    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(brandKor, orderCount),
        },
      ],
    };
  }

  static toContent(brandKor: string, orderCount: number): string {
    return `안녕하세요! ${brandKor} 담당자님, 새로운 주문이 ${orderCount}건 발생했습니다!
    발주확인 처리 요청드립니다.
    `;
  }
}
