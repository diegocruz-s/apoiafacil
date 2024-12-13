import { PaymentController } from "../../application/controllers/Donation/PaymentController";
import { PaymentUseCase } from "../../application/useCases/donation/PaymentUseCase";
import { CampaignRepository } from "../../domain/repositories/mongo/Campaign/DonationCampaignRepository";
import { CreatePaymentRepository } from "../../domain/repositories/mongo/Payment/CreatePaymentRepository";
import { PaymentServiceEfi } from "../../infra/services/PaymentServiceEfi";

export function createDonationFactoryController () {
  const campaignRepository = new CampaignRepository();
  const paymentServiceEfi = new PaymentServiceEfi();
  const createPaymentRepository = new CreatePaymentRepository();

  const paymentUseCase = new PaymentUseCase(
    campaignRepository, paymentServiceEfi, createPaymentRepository,
  );

  const createCampaignController = new PaymentController(
    paymentUseCase
  );

  return {
    createCampaignController,
  };
};
