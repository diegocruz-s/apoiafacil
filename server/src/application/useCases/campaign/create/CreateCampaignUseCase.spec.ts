import { Campaign } from "../../../../domain/entities/Campaign";
import { User } from "../../../../domain/entities/User";
import { IQueueController } from "../../../../infra/lib/protocols";
import { CreateCampaignUseCase } from "./CreateCampaignUseCase";
import { ICreateCampaignRepository, IDatasCampaign, IFindUserByIdRepository, IPixIntegration } from "./protocols";

const userId = 'any_user';
const makeFakeCreateCampaignRepository = (shouldFail = false) => {
  class CreateCampaignRepository implements ICreateCampaignRepository {
    async create(datas: IDatasCampaign): Promise<Campaign | null> {
      return shouldFail ? null : new Campaign(datas);
    }
  }
  return new CreateCampaignRepository();
};
const makeFakeFindUserById = (shouldFail = false) => {
  class FindUserById implements IFindUserByIdRepository {
    async find(userId: string): Promise<User | null> {
      return shouldFail ? null : new User({
        email: 'anyemail@example.com',
        password: 'Any_pass',
        id: userId,
      });
    }
  }
  return new FindUserById();
};
const makeFakePixIntegration = () => {
  class PixIntegration implements IPixIntegration {
    async generatePixQRCode(pixKey: string): Promise<string> {
      return `https://example.com/qrcode/${pixKey}`;
    }
  }
  return new PixIntegration();
};
const makeFakeQueueController = () => {
  class QueueController implements IQueueController {
    async add(name: string, data: unknown): Promise<unknown> {
      return data;
    }

    async process(): Promise<void> {
      console.log('process!');
    }
  }
  return new QueueController();
};

describe('Create Campaign UseCase', () => {
  it('should return a campaign when datas are correct', async () => {
    const createCampaignRepository = makeFakeCreateCampaignRepository();
    const findUserById = makeFakeFindUserById();
    const pixIntegration = makeFakePixIntegration();

    const queueController = makeFakeQueueController();
    jest.spyOn(queueController, 'add');

    const createCampaignUseCase = new CreateCampaignUseCase(
      createCampaignRepository, findUserById, pixIntegration, queueController
    );

    const campaignDatas = {
      name: 'Campaign Test',
      description: 'Any description for campaign',
      expectedValue: 10000,
      photos: ['image1.png', 'image2.png'],
      expiresIn: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      pixKey: 'any_pix_key',
      recipient: 'John Doe',
      categoryId: 'any_category_id',
      userId,
    };

    const { datas, errors } = await createCampaignUseCase.execute(campaignDatas);

    expect(datas!.campaign).toHaveProperty('_id');
    expect(datas!.campaign).toHaveProperty('createdAt');
    expect(datas!.campaign.name).toBe(campaignDatas.name);
    expect(datas!.campaign.description).toBe(campaignDatas.description);
    expect(datas!.campaign.expectedValue).toBe(campaignDatas.expectedValue);
    expect(datas!.campaign.photos).toBe(campaignDatas.photos);
    expect(datas!.campaign.expiresIn).toBe(campaignDatas.expiresIn);
    expect(datas!.campaign.pixKey).toBe(campaignDatas.pixKey);
    expect(datas!.campaign.recipient).toBe(campaignDatas.recipient);
    expect(datas!.campaign.categoryId).toBe(campaignDatas.categoryId);
    expect(datas!.campaign.userId).toBe(campaignDatas.userId);
    expect(datas!.campaign.actualValue).toBe(0);
    expect(datas!.qrcode).toBe(`https://example.com/qrcode/${datas!.campaign.pixKey}`);
    expect(errors).toBeFalsy();
    expect(queueController.add).toHaveBeenCalledTimes(1);
  });

  it('should return an error when repository create returns null', async () => {
    const createCampaignRepository = makeFakeCreateCampaignRepository(true); // Simulate failure
    const findUserById = makeFakeFindUserById();
    const pixIntegration = makeFakePixIntegration();
    const queueController = makeFakeQueueController();

    const createCampaignUseCase = new CreateCampaignUseCase(
      createCampaignRepository, findUserById, pixIntegration, queueController
    );

    const campaignDatas = {
      name: 'Campaign Test',
      description: 'Any description for campaign',
      expectedValue: 10000,
      photos: ['image1.png', 'image2.png'],
      expiresIn: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      pixKey: 'any_pix_key',
      recipient: 'John Doe',
      categoryId: 'any_category_id',
      userId,
    };

    const { datas, errors } = await createCampaignUseCase.execute(campaignDatas);

    expect(datas).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('Error create campaign!');
  });

  it('should return an error when repository findUser returns null', async () => {
    const createCampaignRepository = makeFakeCreateCampaignRepository(); 
    const findUserById = makeFakeFindUserById(true); // Simulate failure
    const pixIntegration = makeFakePixIntegration();
    const queueController = makeFakeQueueController();

    const createCampaignUseCase = new CreateCampaignUseCase(
      createCampaignRepository, findUserById, pixIntegration, queueController
    );

    const campaignDatas = {
      name: 'Campaign Test',
      description: 'Any description for campaign',
      expectedValue: 10000,
      photos: ['image1.png', 'image2.png'],
      expiresIn: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      pixKey: 'any_pix_key',
      recipient: 'John Doe',
      categoryId: 'any_category_id',
      userId,
    };

    const { datas, errors } = await createCampaignUseCase.execute(campaignDatas);

    expect(datas).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('User not found!');
  });
});
