import { ICampaignRepository } from "../../../../application/useCases/donation/protocols";
import { CampaignModel } from "../../../../infra/models/Campaign";
import { Campaign } from "../../../entities/Campaign";
import { MongoMappers } from "../mappers/MongoMappers";

export class CampaignRepository implements ICampaignRepository {
  async execute(campaignId: string): Promise<Campaign | null> {
    const campaign = await CampaignModel.findById(campaignId).exec();

    if (!campaign) return null;

    return MongoMappers.mongoToObjCampaign(campaign);
  };
  
  async updateActualValue(datas: { campaignId: string; amount: number; }): Promise<void> {
    const { campaignId, amount } = datas;

    await CampaignModel.findByIdAndUpdate(
      campaignId,
      { $inc: { actualValue: amount } },
      { new: true }
    ).exec();
  };
};