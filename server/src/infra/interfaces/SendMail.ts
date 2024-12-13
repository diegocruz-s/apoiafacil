export interface IParamsSendMail {
  email: string;
  name: string;
  to: string;
  messageDatas: {
    subject: string;
    body: string
  };
};

export interface IResponseSendMail {
  success?: string;
  error?: string;
};

export interface ISendMail {
  execute(datas: IParamsSendMail): Promise<IResponseSendMail>
};