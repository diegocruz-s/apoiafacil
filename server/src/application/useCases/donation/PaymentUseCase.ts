import { StatusEnum } from "../../../domain/entities/base/StatusEnum";
import { IDatasDonation } from "../../../domain/entities/Donation";
import { ICampaignRepository, 
  IDatasPayment, 
  IPaymentRepository, 
  IPaymentService, 
  IPaymentUseCase, 
  IReturnPayment 
} from "./protocols";

export class PaymentUseCase implements IPaymentUseCase {
  constructor(
    private readonly campaignRepository: ICampaignRepository,
    private readonly paymentService: IPaymentService,
    private readonly paymentRepository: IPaymentRepository,
  ) {};

  async execute(datas: IDatasPayment): Promise<IReturnPayment> {
    const { amount, campaignId, userId } = datas;

    const campaign = await this.campaignRepository.execute(campaignId);

    if (!campaign) {
      return { errors: ['Campaign not found'] };
    };

    const paymentStatus = await this.paymentService.processPayment({
      amount, pixKey: campaign.pixKey,
    });

    const donationStatus = paymentStatus.success 
      ? StatusEnum.COMPLETED 
      : StatusEnum.FAILED;

    const datasDonation: IDatasDonation = {
      amount, campaignId, userId, dateDonation: new Date(), status: donationStatus
    }

    const donation = await this.paymentRepository.create(datasDonation);

    if (!donation) {
      return {
        errors: ['Donation created failed'],
      };
    };

    if (donationStatus === StatusEnum.COMPLETED) {
      await this.campaignRepository.updateActualValue({
        amount,
        campaignId,
      });

      return {
        datas: {
          amount,
          campaignId,
          message: 'Payment successful!',
          donationId: donation.id,
        },
      };
    };
    
    return {
      errors: ['Payment failed'],
    };
  };
};