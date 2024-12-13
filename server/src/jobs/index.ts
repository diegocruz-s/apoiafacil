import { SendMailAws } from '../infra/services/SendMailAws';
import { RegistrationMail } from './RegistrationMail';
// import { ReportUser } from './ReportUser';

const sendMailAws = new SendMailAws();

export const jobs = [new RegistrationMail(sendMailAws)]; 