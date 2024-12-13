import 'dotenv/config';
import { LoginUserUseCase } from "./AuthUseCase";
import { User } from '../../../domain/entities/User';
import { ICompareHash, IGenerateToken, ILoginUserRepository } from './protocols';
import { randomUUID } from 'crypto';
import { IQueueController } from '../../../infra/lib/protocols';

const user = new User({ email: 'any@email.com', password: 'Any_pass' });

const makeFakeQueueController = () => {
  class QueueController implements IQueueController {
    async add(name: string, data: unknown): Promise<unknown> {
      return data;
    };

    async process(): Promise<void> {
      console.log('proccess!'); 
    };
  };

  const queueController = new QueueController();

  return {
    queueController,
  };
};

const makeFakeLoginRepository = () => { 
  class LoginRepository implements ILoginUserRepository {
    private readonly users: User[] = [user];

    async findUser(infoUser: { email: string; }): Promise<User | null> {
      return this.users.find(user => user.email === infoUser.email) || null;
    };
  };

  const loginRepository = new LoginRepository();

  return {
    loginRepository
  };
};

const makeFakeCompareHash = () => {
  class CompareHash implements ICompareHash {
    async run(datas: { password: string; hash: string; }): Promise<boolean> {
      if (datas.password === datas.hash) return true;
      return false;
    }
  };

  const compareHash = new CompareHash();

  return {
    compareHash,
  };
};

const makeFakeGenerateToken = () => {
  class GenerateToken implements IGenerateToken {
    async create(tokenDatas: { id: string; secret: string; expiresIn: string; }): Promise<string> {
      return `${tokenDatas.id}-${tokenDatas.secret}-${tokenDatas.expiresIn}-${randomUUID()}`
    };
  };

  const generateToken = new GenerateToken();

  return {
    generateToken,
  };
};

const makeLoginUserUseCase = () => {
  const { loginRepository } = makeFakeLoginRepository();
  const { compareHash } = makeFakeCompareHash();
  const { generateToken } = makeFakeGenerateToken();
  const { queueController } = makeFakeQueueController();

  const loginUserUseCase = new LoginUserUseCase(
    loginRepository, compareHash, generateToken, queueController
  );

  return {
    loginUserUseCase
  };
};

describe('Login User Use Case', () => {
  it('should return a user and token when datas is valid', async () => {
    const { loginUserUseCase } = makeLoginUserUseCase();

    const { datas, errors } = await loginUserUseCase.execute({
      email: user.email,
      password: user.password,
    });    

    expect(datas!.token.length).toBeGreaterThan(0);
    expect(datas!.user).toHaveProperty('_id');
    expect(datas!.user).not.toHaveProperty('password');
    expect(datas!.user.email).toBeTruthy();
    expect(errors).toBeFalsy();
  });

  it('should return a error when user is not exists', async () => {
    const { loginUserUseCase } = makeLoginUserUseCase();

    const { datas, errors } = await loginUserUseCase.execute({
      email: 'any_email@gmail.com',
      password: user.password,
    });        
    
    expect(datas).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('Authentication failed!');
  });

  it('should return a error when password is not correct', async () => {
    const { loginUserUseCase } = makeLoginUserUseCase();

    const { datas, errors } = await loginUserUseCase.execute({
      email: user.email,
      password: 'Outher_pass',
    });        
    
    expect(datas).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('Authentication failed!');
  });

  it('should return a equal error when password and email is not correct', async () => {
    const { loginUserUseCase } = makeLoginUserUseCase();

    const responseOne = await loginUserUseCase.execute({
      email: user.email,
      password: 'Outher_pass',
    });        
    
    const responseTwo = await loginUserUseCase.execute({
      email: 'any_email@gmail.com',
      password: user.password,
    });   

    expect(responseOne.datas).toBeFalsy();
    expect(responseTwo.datas).toBeFalsy();
    expect(responseOne.errors?.length).toBe(1);
    expect(responseTwo.errors?.length).toBe(1);
    expect(responseOne.errors![0]).toBe(responseTwo.errors![0]);
  });
});
