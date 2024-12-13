import { SES } from "aws-sdk";
import { clientSES } from "../config/aws";
import { IParamsSendMail, IResponseSendMail, ISendMail } from "../interfaces/SendMail";

export class SendMailAws implements ISendMail {
  private client: SES = clientSES;

  async execute(datas: IParamsSendMail): Promise<IResponseSendMail> {
    console.log('AWS Send Mail init!');
    console.log('DatasCallingAWS: ', datas);
    
    const { email, name, to, messageDatas } = datas;

    const response = await this.client.sendEmail({
      Source: `Application <${email}>`,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: messageDatas.subject
        },
        Body: {
          Text: {
            Data: messageDatas.body,
          },
        },
      },
    })
      .promise();

    if (response.$response.error) {
      return {
        error: response.$response.error.message
      };
    };

    return {
      success: 'Email successfully sent!'
    };

  };
};