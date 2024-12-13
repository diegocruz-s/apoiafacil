import { IParamsSendMail } from "../../../../infra/interfaces/SendMail";
import { IQueueController } from "../../../../infra/lib/protocols";
import { EnumJobs } from "../../../../jobs/interfaces/EnumJobs";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";
import { ICreateCampaignRepository, ICreateCampaignUseCase, IDatasCampaign, IFindUserByIdRepository, IPixIntegration } from "./protocols";

export class CreateCampaignUseCase implements ICreateCampaignUseCase {
  constructor (
    private readonly createCampaignRepository: ICreateCampaignRepository,
    private readonly findUserById: IFindUserByIdRepository,
    private readonly pixIntegration: IPixIntegration,
    private readonly queueController: IQueueController,
  ) {};

  async execute(datas: IDatasCampaign): Promise<IReturnCreateCampaign> {
    const campaign = await this.createCampaignRepository.create(datas);
    if (!campaign) {
      return {
        errors: ['Error create campaign!'],
      };
    };

    const user = await this.findUserById.find(campaign.userId);
    if (!user) {
      return {
        errors: ['User not found!'],
      };
    };

    const qrcode = await this.pixIntegration.generatePixQRCode(campaign.pixKey);

    const datasSendMail: IParamsSendMail = {
      email: 'diegosouzacruz464@gmail.com',
      name: 'Diego',
      to: user.email,
      messageDatas: {
        subject: 'Campanha criada com sucesso',
        body: `Campanha com nome: ${campaign.name} criada com sucesso!`,
      },
    }; 

    await this.queueController.add(EnumJobs.REGISTRATIONMAIL, datasSendMail)

    return {
      datas: {
        campaign,
        qrcode,
      },
    };
  };
};