import { randomUUID } from "crypto";
import { GenerateTokenJWT } from "./GenerateTokenJwt";
import { ExpiresIn } from "../../application/useCases/Auth/protocols";

describe('Generate Token Jwt', () => {
  it('should return a token', async () => {
    const generateTokenJwt = new GenerateTokenJWT();
    
    const datasToken = {
      id: randomUUID(),
      secret: 'any_secret',
      expiresIn: ExpiresIn.SEVEN_DAYS,
    };

    const token = await generateTokenJwt.create(datasToken);

    expect(token).toBeTruthy();

  });
});