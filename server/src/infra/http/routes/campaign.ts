import { Router } from "express";
import { createCampaignFactoryController } from "../../../shared/factories/CreateCampaignFactoryController";
import { checkAuth } from "../../../shared/utils/checkAuth";
import { readByIdCampaignFactoryController } from "../../../shared/factories/ReadByIdController";

const routes = Router();
routes.post('/', checkAuth, async (req, res) => {
  const { createCampaignController } = createCampaignFactoryController();
  
  const { body, statusCode } = await createCampaignController.handle({
    body: { ...req.body, userId: req.userId },
  });

  return res.status(statusCode).json(body);

});

routes.get('/:campaignId', async (req, res) => {

  const { readByIdCampaignController } = readByIdCampaignFactoryController();

  const { body, statusCode } = await readByIdCampaignController.handle({
    params: {
      campaignId: req.params.campaignId,
    },
  });

  return res.status(statusCode).json(body);

});

export {
  routes as campaignRoutes,
};