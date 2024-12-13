import { Donation, IDatasDonation } from "../../../domain/entities/Donation";
import { IReadByIdCampaignRepository } from '../globalInterfaces';

export interface IReturnPayment {
  datas?: {
    message: string;
    amount: number;
    campaignId: string;
    donationId: string,
  };
  errors?: string[];
};

export interface IDatasPayment {
  userId: string;
  amount: number;
  campaignId: string;
};

export interface IPaymentRepository {
  create(datas: IDatasDonation): Promise<Donation | null>;
};

export interface ICampaignRepository extends IReadByIdCampaignRepository {
  updateActualValue(datas: { campaignId: string, amount: number }): Promise<void>;
};

export interface IPaymentService {
  processPayment(data: { pixKey: string, amount: number }): Promise<{ success: boolean }>;
};

export interface IPaymentUseCase {
  execute(datas: IDatasPayment): Promise<IReturnPayment>
};
