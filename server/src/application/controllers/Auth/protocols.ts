import { IResponseLoginUser } from "../../interfaces/IReturnDatasLogin";
import { IHttpRequest, IHttpResponse } from "../globalInterfaces";

export interface IDatasLoginUserRequest {
  email: string;
  password: string;
};

export interface ILoginController {
  handle(httpRequest: IHttpRequest<IDatasLoginUserRequest>)
    : Promise<IHttpResponse<IResponseLoginUser>>;
};
