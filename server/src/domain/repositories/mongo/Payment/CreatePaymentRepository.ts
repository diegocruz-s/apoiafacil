import { IPaymentRepository } from "../../../../application/useCases/donation/protocols";
import { DonationModel } from "../../../../infra/models/Donation";
import { Donation } from "../../../entities/Donation";
import { MongoMappers } from "../mappers/MongoMappers";

export class CreatePaymentRepository implements IPaymentRepository {
  async create(datas: Donation): Promise<Donation | null> {
    try {
      console.log({datas});
      
      const donation = await DonationModel.create(datas);

      if (!donation) return null;

      return MongoMappers.mongoToObjDonation(donation);
    } catch (error: any) {
      throw new Error(`Error MongoDB: ${error.message}`);
    };
  };
};
