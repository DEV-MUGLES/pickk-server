import { SlackBlocksBuilder } from './builders';

export abstract class BaseSlackTemplate {
  static blocksBuilder = new SlackBlocksBuilder();
}
