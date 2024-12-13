import { IReadByIdCampaignRepository } from "../../../../application/useCases/globalInterfaces";
import { CampaignModel } from "../../../../infra/models/Campaign";
import { Campaign } from "../../../entities/Campaign";
import { MongoMappers } from "../mappers/MongoMappers";

export class ReadByIdCampaignRepository implements IReadByIdCampaignRepository {
  async execute(campaignId: string): Promise<Campaign | null> {
    const campaign = await CampaignModel.findById(campaignId).exec();

    if (!campaign) return null;

    return MongoMappers.mongoToObjCampaign(campaign);
  };
};