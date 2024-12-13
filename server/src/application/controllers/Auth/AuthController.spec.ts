import { randomUUID } from "crypto";
import { User } from "../../../domain/entities/User";
import { IResponseLoginUser } from "../../interfaces/IReturnDatasLogin";
import { IDatasLoginUser, ILoginUserUseCase } from "../../useCases/Auth/protocols";
import { LoginController } from "./AuthController";

const user = new User({ email: 'any@email.com', password: 'Any_pass' });

const makeFakeLoginUserUseCaseFailed = () => {
  class LoginUserUseCase implements ILoginUserUseCase {
    async execute(datas: IDatasLoginUser): Promise<IResponseLoginUser> {
      return {
        errors: ['Error UseCase'],
      };
    };
  };

  const loginUserUseCase = new LoginUserUseCase();

  return {
    loginUserUseCase
  };
};

const makeFakeLoginControllerFailed = () => {
  const { loginUserUseCase } = makeFakeLoginUserUseCaseFailed();
  const loginController = new LoginController(loginUserUseCase);

  return {
    loginController,
  };
};

const makeFakeLoginUserUseCase = () => {
  class LoginUserUseCase implements ILoginUserUseCase {
    private users: User[] = [user];

    async execute(datas: IDatasLoginUser): Promise<IResponseLoginUser> {
      const { password, ...rest } = this.users[0];

      return {
        datas: {
          token: randomUUID(),
          user: rest as Omit<User, 'password'>,
        },
      };
    };
  };

  const loginUserUseCase = new LoginUserUseCase();

  return {
    loginUserUseCase
  };
};

const makeFakeLoginController = () => {
  const { loginUserUseCase } = makeFakeLoginUserUseCase();
  const loginController = new LoginController(loginUserUseCase);

  return {
    loginController,
  };
};

describe('Login User Controller', () => {
  it('should return datas user and token and status code response', async () => {
    const { loginController } = makeFakeLoginController();
    const datasLogin = {
      email: user.email,
      password: user.password,
    };

    const { statusCode, body } = await loginController.handle({ 
      body: datasLogin,
    });
    
    expect(statusCode).toBe(200);
    expect(body.errors).toBeFalsy();
    expect(body.datas?.token.length).toBeGreaterThan(1);
    expect(body.datas?.user).toHaveProperty('_id');
    expect(body.datas?.user).not.toHaveProperty('password');
    expect(body.datas?.user.email).toBe(datasLogin.email);
  });

  it('should return a error when email is not valid', async () => {
    const { loginController } = makeFakeLoginController();
    const datasLogin = {
      email: 'any_text',
      password: user.password,
    };

    const { statusCode, body } = await loginController.handle({ 
      body: datasLogin,
    });
    
    expect(statusCode).toBe(422);
    expect(body.datas?.token).toBeFalsy();
    expect(body.datas?.user).toBeFalsy();
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0].includes('email')).toBeTruthy();
  });

  it('should return a error when password is not valid', async () => {
    const { loginController } = makeFakeLoginController();
    const datasLogin = {
      email: user.email,
      password: 'any',
    };

    const { statusCode, body } = await loginController.handle({ 
      body: datasLogin,
    });
    
    expect(statusCode).toBe(422);
    expect(body.datas?.token).toBeFalsy();
    expect(body.datas?.user).toBeFalsy();
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0].includes('password')).toBeTruthy();
  });

  it('should return a error when password and email is not valid', async () => {
    const { loginController } = makeFakeLoginController();
    const datasLogin = {
      email: 'any_email',
      password: 'any',
    };

    const { statusCode, body } = await loginController.handle({ 
      body: datasLogin,
    });    

    expect(statusCode).toBe(422);
    expect(body.datas?.token).toBeFalsy();
    expect(body.datas?.user).toBeFalsy();
    expect(body.errors?.length).toBe(2);
    expect(body.errors![0].includes('email')).toBeTruthy();
    expect(body.errors![1].includes('password')).toBeTruthy();
  });

  it('should return a error when useCase return a error', async () => {
    const { loginController } = makeFakeLoginControllerFailed();
    const datasLogin = {
      email: user.email,
      password: user.password,
    };

    const { statusCode, body } = await loginController.handle({ 
      body: datasLogin,
    });

    expect(statusCode).toBe(422);
    expect(body.datas?.token).toBeFalsy();
    expect(body.datas?.user).toBeFalsy();
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe('Error UseCase');
  });

  it("should return a 500 error on unexpected exception", async () => {
    const createCampaignController = new LoginController({
      execute: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    });
    const datasLogin = {
      email: user.email,
      password: user.password,
    };

    const { statusCode, body } = await createCampaignController.handle({ body: datasLogin });

    expect(statusCode).toBe(500);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Unexpected error");
  });
});