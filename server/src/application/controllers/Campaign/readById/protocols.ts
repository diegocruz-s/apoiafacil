import { IReadByIdReturn } from "../../../interfaces/IReadByIdReturn";
import { IHttpRequest, IHttpResponse } from "../../globalInterfaces";

export interface IReadByIdCampaignController {
  handle(httpRequest: IHttpRequest<{ campaignId: string }>)
    : Promise<IHttpResponse<IReadByIdReturn>>;
};