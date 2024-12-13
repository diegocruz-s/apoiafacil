import { randomUUID } from "crypto";
import { Campaign } from "../../../../domain/entities/Campaign";
import { ReadCampaignByIdUseCase } from "./IReadCampaignById";
import { IReadCampaignByIdRepository } from "./protocols";

const firstIdCampaign = 'first';
const secondIdCampaign = 'second';

const makeCampaign = (id: string) => {
  const campaign = new Campaign({
    id,
    categoryId: randomUUID(),
    userId: randomUUID(),
    description: "A detailed description of the campaign.A detailed description of the campaign.A detailed description of the campaign.",
    expectedValue: 1000,
    expiresIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days ahead
    name: "Help the community",
    photos: ["https://example.com/photo1.jpg"],
    pixKey: "example-pix-key",
    recipient: "Community Center",
  });

  return campaign;
};

const makeFakeRepository = () => {
  class ReadCampaignByIdRepository implements IReadCampaignByIdRepository {
    private campaigns: Campaign[] = [makeCampaign(firstIdCampaign), makeCampaign(secondIdCampaign)];

    async execute(campaignId: string): Promise<Campaign | null> {
      return this.campaigns.filter(campaign => campaign.id === campaignId)[0];
    };
  };

  const readCampaignByIdRepository = new ReadCampaignByIdRepository();

  return {
    readCampaignByIdRepository,
  };
};

const makeFakeUseCase = () => {
  const { readCampaignByIdRepository } = makeFakeRepository();
  const readCampaignByIdUseCase = new ReadCampaignByIdUseCase(readCampaignByIdRepository);

  return {
    readCampaignByIdUseCase,
  };
};

describe('Read Campaign By Id UseCase', () => {
  it ('should return a campaign by id as correct', async () => {
    const { readCampaignByIdUseCase } = makeFakeUseCase();
  
    const { datas, errors } = await readCampaignByIdUseCase.execute(firstIdCampaign);
    Campaign
    expect(errors).toBeFalsy();
    expect(datas).toBeTruthy();
    expect(datas).toHaveProperty('campaign');
    expect(datas?.campaign.id).toBe(firstIdCampaign);
  });

  it ('should return error was campaign is not found', async () => {
    const { readCampaignByIdUseCase } = makeFakeUseCase();
  
    const { datas, errors } = await readCampaignByIdUseCase.execute('incorrect_value_id');

    expect(errors).toBeTruthy();
    expect(errors![0]).toBe('Campaign not found!');
    expect(datas).toBeFalsy();
  });
});