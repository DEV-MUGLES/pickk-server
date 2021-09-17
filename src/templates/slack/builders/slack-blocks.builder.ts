import { KnownBlock, Button } from '@slack/types';

export class SlackBlocksBuilder {
  private blocks: KnownBlock[] = [];

  addText(text: string) {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
    });
    return this;
  }

  addSection(texts: string[]) {
    this.blocks.push({
      type: 'section',
      fields: texts.map((text) => ({
        type: 'mrkdwn',
        text,
      })),
    });
    return this;
  }

  addButtons(inputs: Array<Pick<Button, 'style' | 'url'> & { text: string }>) {
    this.blocks.push({
      type: 'actions',
      elements: inputs.map(({ text, url, style }) => ({
        type: 'button',
        text: {
          type: 'plain_text',
          text,
        },
        url,
        style,
      })),
    });
    return this;
  }

  addContext(text: string) {
    this.blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text,
        },
      ],
    });
    return this;
  }

  build() {
    return this.blocks;
  }
}
