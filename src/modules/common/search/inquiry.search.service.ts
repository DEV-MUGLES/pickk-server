import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { Inquiry } from '@item/inquiries/models';
import { InquiriesService } from '@item/inquiries/inquiries.service';

export type InquirySearchBody = Pick<
  Inquiry,
  | 'type'
  | 'title'
  | 'content'
  | 'contactPhoneNumber'
  | 'isAnswered'
  | 'orderItemMerchantUid'
  | 'createdAt'
  | 'sellerId'
> & {
  id: string;
  userNickname: string;
  itemName: string;
  orderBuyerName: string;
};

@Injectable()
export class InquirySearchService extends BaseSearchService<
  Inquiry,
  InquirySearchBody
> {
  name = 'inquiries_index';

  constructor(
    private readonly inquiriesService: InquiriesService,
    readonly searchService: SearchService
  ) {
    super();
  }

  async getModel(id: number): Promise<Inquiry> {
    return await this.inquiriesService.get(id, [
      'orderItem',
      'orderItem.order',
      'orderItem.order.buyer',
      'item',
      'user',
    ]);
  }

  toBody(inquiry: Inquiry): InquirySearchBody {
    return {
      id: inquiry.id.toString(),
      type: inquiry.type,
      title: inquiry.title,
      content: inquiry.content,
      contactPhoneNumber: inquiry.contactPhoneNumber,
      isAnswered: inquiry.isAnswered,
      orderItemMerchantUid: inquiry.orderItemMerchantUid,
      createdAt: inquiry.createdAt,
      sellerId: inquiry.sellerId,
      userNickname: inquiry?.user?.nickname,
      itemName: inquiry?.item?.name,
      orderBuyerName: inquiry?.orderItem?.order?.buyer?.name,
    };
  }
}
