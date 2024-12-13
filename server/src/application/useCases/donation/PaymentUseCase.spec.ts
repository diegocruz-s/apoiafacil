import { PaymentUseCase } from "./PaymentUseCase";
import { Donation } from "../../../domain/entities/Donation";
import { 
  IPaymentService, 
  ICampaignRepository, 
  IPaymentRepository, 
  IDatasPayment, 
  IReturnPayment 
} from "./protocols";
import { Campaign } from "../../../domain/entities/Campaign";

describe('Payment UseCase', () => {
  const makeFakePaymentService = () => {
    class PaymentService implements IPaymentService {
      async processPayment(data: { pixKey: string; amount: number; }): Promise<{ success: boolean; }> {
        return { success: true, };
      };
    };

    return new PaymentService();
  };

  const makeFakePaymentServiceFailed = (): IPaymentService => {
    class PaymentService implements IPaymentService {
      async processPayment(data: { pixKey: string; amount: number; }): Promise<{ success: boolean; }> {
        return { success: false };
      };
    }
    return new PaymentService();
  };

  const makeFakeCampaignRepository = () => {
    class CampaignRepository implements ICampaignRepository {

      async execute(campaignId: string): Promise<Campaign | null> {
        return new Campaign({
          id: campaignId,
          userId: 'valid_user_id',
          categoryId: 'valid_category_id',
          name: 'Valid Campaign',
          description: 'A valid campaign description',
          expectedValue: 1000,
          photos: ['photo1.jpg', 'photo2.jpg'],
          expiresIn: new Date(),
          pixKey: 'valid_pix_key',
          recipient: 'Valid Recipient',
        });
      };

      async updateActualValue({}: { amount: number; campaignId: string }): Promise<void> {
        return;
      };
    };
    return new CampaignRepository();
  };

  const makeFakeCampaignRepositoryNotFound = () => {
    class CampaignRepository implements ICampaignRepository {
      async execute(campaignId: string): Promise<null> {
        return null;
      }

      async updateActualValue({campaignId}: { amount: number; campaignId: string }): Promise<void> {
        return;
      }
    }
    return new CampaignRepository();
  };

  const makeFakePaymentRepository = (): IPaymentRepository => {
    class PaymentRepository implements IPaymentRepository {
      async create(datas: Donation): Promise<Donation | null> {
        return new Donation(datas);
      };
    }
    return new PaymentRepository();
  };

  const generatePaymentUseCase = ({
    paymentService = makeFakePaymentService(),
    campaignRepository = makeFakeCampaignRepository(),
    paymentRepository = makeFakePaymentRepository(),
  } = {}): PaymentUseCase => {
    return new PaymentUseCase(campaignRepository, paymentService, paymentRepository);
  };

  it('should process payment successfully', async () => {
    const paymentUseCase = generatePaymentUseCase();

    const paymentData: IDatasPayment = {
      amount: 100,
      campaignId: 'valid_campaign_id',
      userId: 'valid_user_id',
    };

    const result: IReturnPayment = await paymentUseCase.execute(paymentData);
    
    expect(result.errors).toBeFalsy();
    expect(result.datas).toBeTruthy();
    expect(result.datas).toHaveProperty('donationId');
    expect(result.datas?.message).toBe('Payment successful!');
    expect(result.datas?.amount).toBe(100);
    expect(result.datas?.campaignId).toBe('valid_campaign_id');
  });

  it('should return an error if campaign is not found', async () => {
    const paymentUseCase = generatePaymentUseCase({
      campaignRepository: makeFakeCampaignRepositoryNotFound(),
    });

    const paymentData: IDatasPayment = {
      amount: 100,
      campaignId: 'invalid_campaign_id',
      userId: 'valid_user_id',
    };

    const result: IReturnPayment = await paymentUseCase.execute(paymentData);

    expect(result.datas).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors![0]).toBe('Campaign not found');
  });

  it('should return an error if payment fails', async () => {
    const paymentUseCase = generatePaymentUseCase({
      paymentService: makeFakePaymentServiceFailed(),
    });

    const paymentData: IDatasPayment = {
      amount: 100,
      campaignId: 'valid_campaign_id',
      userId: 'valid_user_id',
    };

    const result: IReturnPayment = await paymentUseCase.execute(paymentData);

    expect(result.datas).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors![0]).toBe('Payment failed');
  });
});