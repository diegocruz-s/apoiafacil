import { Router } from "express";
import { checkAuth } from "../../../shared/utils/checkAuth";
import { createDonationFactoryController } from "../../../shared/factories/DonationFactoryController";

const routes = Router();
routes.post('/:campaignId', checkAuth, async (req, res) => {
  const { createCampaignController } = createDonationFactoryController();
  
  const { body, statusCode } = await createCampaignController.handle({
    body: { 
      ...req.body, 
      userId: req.userId,
      campaignId: req.params.campaignId,
    },
  });

  return res.status(statusCode).json(body);

});

export {
  routes as paymentRoutes,
};