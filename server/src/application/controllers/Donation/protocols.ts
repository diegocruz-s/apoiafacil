import { IDatasPayment, IReturnPayment } from "../../useCases/donation/protocols";
import { IHttpRequest, IHttpResponse } from "../globalInterfaces";

export interface IPaymentController {
  handle(httpRequest: IHttpRequest<IDatasPayment>): Promise<IHttpResponse<IReturnPayment>>
};