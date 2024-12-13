import { User } from "../../../domain/entities/User";
import { IParamsSendMail } from "../../../infra/interfaces/SendMail";
import { IQueueController } from "../../../infra/lib/protocols";
import { EnumJobs } from "../../../jobs/interfaces/EnumJobs";
import { IResponseLoginUser } from "../../interfaces/IReturnDatasLogin";
import { 
  ExpiresIn, 
  ICompareHash, 
  IDatasLoginUser, 
  IGenerateToken, 
  ILoginUserRepository, 
  ILoginUserUseCase 
} from "./protocols";

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor (
    private readonly loginRepository: ILoginUserRepository,
    private readonly compareHash: ICompareHash,
    private readonly generateToken: IGenerateToken,
    private readonly queueController: IQueueController,
  ){};

  async execute(datas: IDatasLoginUser): Promise<IResponseLoginUser> {
    const { email, password } = datas;    
    const user = await this.loginRepository.findUser({ email });

    if (!user) {
      return {
        errors: ['Authentication failed!'],
      };
    };

    const isValidPass = await this.compareHash.run({
      password, 
      hash: user.password,
    });

    if (!isValidPass) {      
      return {
        errors: ['Authentication failed!'],
      };
    };

    const accessToken = await this.generateToken.create({
      id: user.id,
      secret: process.env.SECRET_TOKEN || 'any_token',
      expiresIn: ExpiresIn.SEVEN_DAYS,
    });

    const { password: notPass, ...rest } = user;
    
    const datasSendMail: IParamsSendMail = {
      email: 'diegosouzacruz464@gmail.com',
      name: 'Diego',
      to: email,
      messageDatas: {
        subject: 'Send Mail Testing Application Nekst',
        body: 'Sending email testing for Nekst using AWS and background jobs!!!',
      },
    };
    await this.queueController.add(EnumJobs.REGISTRATIONMAIL, datasSendMail); 

    return {
      datas: {
        user: rest as Omit<User, 'password'>,
        token: accessToken,
      },
    };
  };
};
