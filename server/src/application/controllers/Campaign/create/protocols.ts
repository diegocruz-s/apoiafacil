
import { IDatasCampaign } from "../../../../domain/entities/Campaign";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";
import { IHttpRequest, IHttpResponse } from "../../globalInterfaces";

export interface ICreateCampaignController {
  handle(httpRequest: IHttpRequest<IDatasCampaign>)
    : Promise<IHttpResponse<IReturnCreateCampaign>>;
};