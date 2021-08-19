import { Look } from '../models';

export type LookRelationType = keyof Look;

export const LOOK_RELATIONS: LookRelationType[] = ['user', 'digests'];
