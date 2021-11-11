import { IncomingWebhookSendArguments } from '@slack/webhook';

import { SlackChannelName } from '@providers/slack/constants';

import { BaseSlackTemplate } from './base-slack.template';

export class ContentReportedTemplate extends BaseSlackTemplate {
  static create(url: string): IncomingWebhookSendArguments {
    return {
      channel: SlackChannelName.ContentUpload,
      blocks: this.getBlocksBuilder()
        .addText('*🚨 불량 컨텐츠 신고가 접수되었습니다*')
        .addText('확인 후 불쾌감을 주는 컨텐츠라면 삭제해주세요')
        .addText(`*<${url}|${url}>*`)
        .build(),
    };
  }
}
