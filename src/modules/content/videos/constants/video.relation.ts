import { Video } from '../models';

export type VideoRelationType = keyof Video;

export const VIDEO_RELATIONS: VideoRelationType[] = ['user', 'digests'];
