import { Campaign } from "../../domain/entities/Campaign";

export interface IReadByIdReturn {
  datas?: {
    campaign: Campaign;
  };
  errors?: string[];
};