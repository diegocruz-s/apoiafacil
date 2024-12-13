import { randomUUID } from "crypto";
import { User } from "../../domain/entities/User";
import { internalServerError, ok, unprocessable } from "./returnsHttp";

describe('Returns HTTP', () => {
  it('should return a statusCode 200 and datas', async () => {
    const datas = {
      token: 'any_token',
      user: new User({
        email: 'any_email@gmail.com',
        password: 'any_pass',
        id: randomUUID(),
      }),
    };

    const returnSuccess = ok(datas);    

    expect(returnSuccess.statusCode).toBe(200);
    expect(returnSuccess.body.datas).toEqual(datas);
  });

  it('should return a statusCode 422 and errors', async () => {
    const errors = ['Any_error'];

    const returnError = unprocessable({ errors });

    expect(returnError.statusCode).toBe(422);
    expect(returnError.body).toEqual({ errors });
  });

  it('should return a statusCode 500 and errors', async () => {
    const errors = ['Any_error'];

    const returnError = internalServerError({ errors });

    expect(returnError.statusCode).toBe(500);
    expect(returnError.body).toEqual({ errors });
  });
});