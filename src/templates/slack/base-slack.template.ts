import { SlackBlocksBuilder } from './builders';

export abstract class BaseSlackTemplate {
  static getBlocksBuilder() {
    return new SlackBlocksBuilder();
  }
}
