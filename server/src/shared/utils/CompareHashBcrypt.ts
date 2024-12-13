import { compare } from "bcryptjs";
import { ICompareHash } from "../../application/useCases/Auth/protocols";

export class CompareHashBcrypt implements ICompareHash {
  async run(datas: { password: string; hash: string; }): Promise<boolean> {
    const isPwdsMatch = await compare(datas.password, datas.hash);

    return isPwdsMatch;
  };
};
