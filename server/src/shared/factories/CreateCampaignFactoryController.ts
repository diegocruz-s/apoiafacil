import { CreateCampaignController } from "../../application/controllers/Campaign/create/CreateCampaignController";
import { CreateCampaignUseCase } from "../../application/useCases/campaign/create/CreateCampaignUseCase";
import { CreateCampaignRepository } from "../../domain/repositories/mongo/Campaign/CreateCampaignRepository";
import { PixIntegrationEfi } from "../../infra/services/PixIntegrationEfi";
import { queueController } from "../../infra/lib/Queue";
import { FindUserByIdRepository } from "../../domain/repositories/mongo/User/FindUserByIdRepository";

export function createCampaignFactoryController () {
  const createCampaignRepository = new CreateCampaignRepository();
  const pixIntegrationEfi = new PixIntegrationEfi();
  const findUserByIdRepository = new FindUserByIdRepository();

  const createCampaignUseCase = new CreateCampaignUseCase(
    createCampaignRepository, findUserByIdRepository, pixIntegrationEfi, queueController
  );

  const createCampaignController = new CreateCampaignController(createCampaignUseCase);

  return {
    createCampaignController,
  };
};
