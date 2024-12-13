import { PaymentController } from "./PaymentController";
import { IDatasPayment, IReturnPayment, IPaymentUseCase } from "../../useCases/donation/protocols";

const makeFakePaymentData = (): IDatasPayment => ({
  amount: 100,
  campaignId: "00000000-0000-0000-0000-000000000000",
  userId: "11111111-1111-1111-1111-111111111111",
});

const makeFakePaymentUseCase = () => {
  class PaymentUseCase implements IPaymentUseCase {
    async execute(datas: IDatasPayment): Promise<IReturnPayment> {
      return {
        datas: {
          message: "Payment successful!",
          amount: datas.amount,
          campaignId: datas.campaignId,
          donationId: 'valid_donation_id',
        },
      };
    }
  }

  return new PaymentUseCase();
};

const makeFakePaymentUseCaseFailed = () => {
  class PaymentUseCase implements IPaymentUseCase {
    async execute(datas: IDatasPayment): Promise<IReturnPayment> {
      return { errors: ["Payment failed"] };
    }
  }

  return new PaymentUseCase();
};

describe("MakePaymentController", () => {
  it("should return 200 when payment is successful", async () => {
    const paymentUseCase = makeFakePaymentUseCase();
    const paymentController = new PaymentController(paymentUseCase);

    const httpRequest = { body: makeFakePaymentData() };
    const { statusCode, body } = await paymentController.handle(httpRequest);

    expect(statusCode).toBe(200);
    expect(body.errors).toBeFalsy();
    expect(body.datas?.message).toBe("Payment successful!");
  });

  it("should return 422 when payment fails", async () => {
    const paymentUseCase = makeFakePaymentUseCaseFailed();
    const paymentController = new PaymentController(paymentUseCase);

    const httpRequest = { body: makeFakePaymentData() };
    const { statusCode, body } = await paymentController.handle(httpRequest);

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Payment failed");
  });

  it("should return 422 when validation fails", async () => {
    const paymentUseCase = makeFakePaymentUseCase();
    const paymentController = new PaymentController(paymentUseCase);

    const invalidData = { ...makeFakePaymentData(), amount: -100 }; 
    const httpRequest = { body: invalidData };

    const { statusCode, body } = await paymentController.handle(httpRequest);

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain("Amount must be greater than zero");
  });

  it("should return 500 on unexpected error", async () => {
    const paymentController = new PaymentController({
      execute: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    });

    const httpRequest = { body: makeFakePaymentData() };
    const { statusCode, body } = await paymentController.handle(httpRequest);

    expect(statusCode).toBe(500);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Unexpected error");
  });
});
