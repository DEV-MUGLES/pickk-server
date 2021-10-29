import { Campaign } from '../models';

export type CampaignRelationType = keyof Campaign;

export const CAMPAIGN_RELATIONS: Array<CampaignRelationType> = ['items'];
