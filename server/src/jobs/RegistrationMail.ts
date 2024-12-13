import { clientSES } from "../infra/config/aws";
import { IParamsSendMail, ISendMail } from "../infra/interfaces/SendMail";
import { IJob } from "./interfaces/IJob";

export class RegistrationMail implements IJob {
  constructor (
    private readonly sendMail: ISendMail,
  ) {};
 
  public key = 'RegistrationMail';
  public options = {};

  async handle ({ email, name, to, messageDatas }: IParamsSendMail) { 
    console.log('Send Mail!');
    console.log('DatasRegistrationMail: ', email, name, to, messageDatas);
    
    try {
      console.log('Send Mail 2!');
      await this.sendMail.execute({
        email, name, to, messageDatas
      });
      console.log('Send Mail 3!');
    } catch (error: any) {
      console.log('Send Mail error!');
      console.log('error.message: ', error.message);
      throw new Error(error.message);
    }; 
  };
};


