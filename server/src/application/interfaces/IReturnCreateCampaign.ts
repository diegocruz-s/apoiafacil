import { Campaign } from "../../domain/entities/Campaign";

export interface IReturnCreateCampaign {
  datas?: {
    campaign: Campaign;
    qrcode: string;
  };
  errors?: string[];
};