import { IGenerateToken } from "../../application/useCases/Auth/protocols";
import { sign } from 'jsonwebtoken';

export class GenerateTokenJWT implements IGenerateToken {
  async create(tokenDatas: { id: string; secret: string; expiresIn: string; }): Promise<string> {
    const { id, secret, expiresIn } = tokenDatas;
    const token = await sign({ id }, secret, {
      expiresIn
    });

    return token;
  }
};