import { z } from "zod";
import { IReadByIdReturn } from "../../../interfaces/IReadByIdReturn";
import { IHttpRequest, IHttpResponse } from "../../globalInterfaces";
import { IReadByIdCampaignController } from "./protocols";
import { validation } from "../../../../shared/utils/validationZod";
import { internalServerError, ok, unprocessable } from "../../../../shared/utils/returnsHttp";
import { IReadCampaignByIdUseCase } from "../../../useCases/campaign/readById/protocols";

const validationReadByIdCampaign = z.object({
  campaignId: z.string(),
});

export class ReadByIdCampaignController implements IReadByIdCampaignController {
  constructor (
    private readonly readCampaignByIdUseCase: IReadCampaignByIdUseCase,
  ) {};

  async handle(httpRequest: IHttpRequest<{ campaignId: string; }>): Promise<IHttpResponse<IReadByIdReturn>> {
    try {      
      const { isValid, errors: errorsValidation } = await validation({
        body: httpRequest.params,
        schema: validationReadByIdCampaign,
      });      
  
      if (!isValid && !!errorsValidation) 
        return unprocessable({ errors: errorsValidation });

      const { datas, errors } = await this.readCampaignByIdUseCase.execute(
        httpRequest.params?.campaignId!,
      );
    
      if(errors) 
        return unprocessable({ errors });
  
      return ok(datas);
    } catch (error: any) {      
      return internalServerError({ errors: [error.message] });
    };
  };
};