import { User } from "aws-sdk/clients/budgets";
import { Campaign } from "../../domain/entities/Campaign";

export interface IReadByIdCampaignRepository {
  execute(campaignId: string): Promise<Campaign | null>;
};
