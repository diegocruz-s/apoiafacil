import { Campaign } from "../../../../domain/entities/Campaign";
import { User } from "../../../../domain/entities/User";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";

export interface IDatasCampaign {
  name: string;
  description: string;
  expectedValue: number;
  photos: string[];
  expiresIn: Date;
  pixKey: string;
  recipient: string;
  categoryId: string;
  userId: string;
};

export interface IPixIntegration {
  generatePixQRCode(pixKey: string): Promise<string>;
};

export interface ICreateCampaignUseCase {
  execute(datas: IDatasCampaign): Promise<IReturnCreateCampaign>;
};

export interface ICreateCampaignRepository {
  create(datas: IDatasCampaign): Promise<Campaign | null>;
};

export interface IFindUserByIdRepository {
  find(userId: string): Promise<User | null>;
}