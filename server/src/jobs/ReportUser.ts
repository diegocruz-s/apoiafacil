import { IJob } from "./interfaces/IJob";

export class ReportUser implements IJob {
  public key = 'ReportUser';
  public options = {};

  async handle () {
    console.log('ReportUser');
  };
};

