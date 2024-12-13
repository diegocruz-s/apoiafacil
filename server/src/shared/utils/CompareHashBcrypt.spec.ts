import { hash } from "bcryptjs";
import { CompareHashBcrypt } from "./CompareHashBcrypt";

describe('Compare Hash Bcrypt', () => {
  it('should return a true when password match hash', async () => {
    const { run } = new CompareHashBcrypt();

    const pwd = 'Any_pass';
    const hashPwd = await hash(pwd, 8);

    const resultCompareHash = await run({ password: pwd, hash: hashPwd });

    expect(resultCompareHash).toBe(true);
  });

  it('should return a false when password not match hash', async () => {
    const { run } = new CompareHashBcrypt();

    const pwd = 'Any_pass';
    const hashPwd = await hash(pwd, 8);

    const resultCompareHash = await run({ password: 'Outher_pass', hash: hashPwd });

    expect(resultCompareHash).toBe(false);
  });

});