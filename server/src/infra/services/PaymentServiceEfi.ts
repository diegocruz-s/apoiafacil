import { IPaymentService } from "../../application/useCases/donation/protocols";

export class PaymentServiceEfi implements IPaymentService {
  async processPayment(datas: { pixKey: string; amount: number }): Promise<{
    success: boolean;
  }> {
    if (datas.amount > 0) {
      return {
        success: true,
      };
    }

    return {
      success: false,
    };
  }
}
