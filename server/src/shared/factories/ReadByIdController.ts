import { ReadByIdCampaignController } from "../../application/controllers/Campaign/readById/ReadByIdController";
import { ReadCampaignByIdUseCase } from "../../application/useCases/campaign/readById/IReadCampaignById";
import { ReadByIdCampaignRepository } from "../../domain/repositories/mongo/Campaign/ReadByIdCampaignRepository";

export function readByIdCampaignFactoryController () {
  const readByIdCampaignRepository = new ReadByIdCampaignRepository();

  const readByIdCampaignUseCase = new ReadCampaignByIdUseCase(
    readByIdCampaignRepository,
  );

  const readByIdCampaignController = new ReadByIdCampaignController(readByIdCampaignUseCase);

  return {
    readByIdCampaignController,
  };
};
