import { Campaign } from "../../../../domain/entities/Campaign";
import { IReadByIdReturn } from "../../../interfaces/IReadByIdReturn";
import { IReadByIdCampaignRepository } from "../../globalInterfaces";

export interface IReadCampaignByIdRepository extends IReadByIdCampaignRepository {};

export interface IReadCampaignByIdUseCase {
  execute (campaignId: string): Promise<IReadByIdReturn>;
};