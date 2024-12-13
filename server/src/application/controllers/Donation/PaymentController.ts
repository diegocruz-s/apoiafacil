// MakePaymentController.ts

import { internalServerError, ok, unprocessable } from "../../../shared/utils/returnsHttp";
import { validation } from "../../../shared/utils/validationZod";
import { IDatasPayment, IPaymentUseCase, IReturnPayment } from "../../useCases/donation/protocols";
import { IHttpRequest, IHttpResponse } from "../globalInterfaces";
import { IPaymentController } from "./protocols";
import { z } from "zod";

export const validationPaymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than zero"),
  campaignId: z.string({ message: "CampaignId is required" }),
  userId: z.string({ message: "UserId is required" }),
});

export class PaymentController implements IPaymentController {
  constructor (
    private readonly paymentUseCase: IPaymentUseCase,
  ) {}

  async handle(httpRequest: IHttpRequest<IDatasPayment>): Promise<IHttpResponse<IReturnPayment>> {
    try {
      const { isValid, errors: errorsValidation } = await validation({
        body: httpRequest.body,
        schema: validationPaymentSchema,
      });

      if (!isValid && !!errorsValidation) 
        return unprocessable({ errors: errorsValidation });

      const { datas, errors } = await this.paymentUseCase.execute(httpRequest.body!);

      if (errors)
        return unprocessable({ errors });

      return ok(datas);
    } catch (error: any) {
      return internalServerError({ errors: [error.message] });
    }
  }
}
