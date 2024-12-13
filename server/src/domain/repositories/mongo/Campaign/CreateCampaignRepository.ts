import { ICreateCampaignRepository, IDatasCampaign } from "../../../../application/useCases/campaign/create/protocols";
import { CampaignModel } from "../../../../infra/models/Campaign";
import { Campaign } from "../../../entities/Campaign";
import { MongoMappers } from "../mappers/MongoMappers";
import { Types, ObjectId } from "mongoose";

 
export class CreateCampaignRepository implements ICreateCampaignRepository {
  async create(datas: IDatasCampaign): Promise<Campaign | null> {
    try {
      const categoryIdToObjectId = new Types.ObjectId(datas.categoryId);
      const campaign = await CampaignModel.create({ ...datas, categoryId: categoryIdToObjectId });

      if (!campaign) return null;
      
      return MongoMappers.mongoToObjCampaign(campaign);
    } catch (error: any) {
      throw new Error(`Error MongoDB: ${error.message}`);
    };
  };
};

