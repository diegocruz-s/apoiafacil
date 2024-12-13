import { IReadByIdReturn } from "../../../interfaces/IReadByIdReturn";
import { IReadCampaignByIdRepository, IReadCampaignByIdUseCase } from "./protocols";

export class ReadCampaignByIdUseCase implements IReadCampaignByIdUseCase {
  constructor(
    private readonly readCampaignByIdRepository: IReadCampaignByIdRepository,
  ) {};

  async execute(campaignId: string): Promise<IReadByIdReturn> {
    const campaign = await this.readCampaignByIdRepository.execute(campaignId);
    
    if (!campaign) {
      return {
        errors: ['Campaign not found!']
      };
    };

    return {
      datas: {
        campaign,
      },
    };
  };
};