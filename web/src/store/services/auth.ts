import { api } from "../../utils/api";
import { IAuth } from "../slices/authSlice";

export const loginService = async (datas: IAuth) => {
  try {
    const res = await api.post('/auth', datas)
      .then(response => {
        return response.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    return res;
  } catch (error: any) {
    return [error.message];
  };
}