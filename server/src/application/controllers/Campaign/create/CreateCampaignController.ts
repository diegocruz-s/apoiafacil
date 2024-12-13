import { z } from "zod";
import { IDatasCampaign } from "../../../../domain/entities/Campaign";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";
import { IHttpRequest, IHttpResponse } from "../../globalInterfaces";
import { ICreateCampaignController } from "./protocols";
import { validation } from "../../../../shared/utils/validationZod";
import { internalServerError, ok, unprocessable } from "../../../../shared/utils/returnsHttp";
import { ICreateCampaignUseCase } from "../../../useCases/campaign/create/protocols";

const validationCreateCampaign = z.object({
  categoryId: z.string(),
  userId: z.string(),
  description: z.string().min(50, { message: "Description must have at least 50 characters" }),
  expectedValue: z.coerce.number().min(500, { message: "Expected value must be at least 500" }),
  expiresIn: z.coerce.date(),
  name: z.string().min(5),
  photos: z.array(z.string()),
  pixKey: z.string(),
  recipient: z.string(),
});

export class CreateCampaignController implements ICreateCampaignController {
  constructor (
    private readonly createCampaignUseCase: ICreateCampaignUseCase,
  ) {};

  async handle(httpRequest: IHttpRequest<IDatasCampaign>): Promise<IHttpResponse<IReturnCreateCampaign>> {
    try {
      const { isValid, errors: errorsValidation } = await validation({
        body: httpRequest.body,
        schema: validationCreateCampaign,
      });      
  
      if (!isValid && !!errorsValidation) 
        return unprocessable({ errors: errorsValidation });

      const { datas, errors } = await this.createCampaignUseCase.execute(httpRequest.body!);
    
      if(errors) 
        return unprocessable({ errors });
  
      return ok(datas);
    } catch (error: any) {      
      return internalServerError({ errors: [error.message] });
    };
  };
};