import { randomUUID } from "crypto";
import { Campaign, IDatasCampaign } from "../../../../domain/entities/Campaign";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";
import { ICreateCampaignUseCase } from "../../../useCases/campaign/create/protocols";
import { ReadByIdCampaignController } from "./ReadByIdController";
import { ReadCampaignByIdUseCase } from "../../../useCases/campaign/readById/IReadCampaignById";
import { IReadCampaignByIdUseCase } from "../../../useCases/campaign/readById/protocols";
import { IReadByIdReturn } from "../../../interfaces/IReadByIdReturn";

const campaignId = 'campaignId';

const campaign =  new Campaign({
  categoryId: randomUUID(),
  id: campaignId,
  userId: randomUUID(),
  description: "A detailed description of the campaign.A detailed description of the campaign.A detailed description of the campaign.",
  expectedValue: 1000,
  expiresIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days ahead
  name: "Help the community",
  photos: ["https://example.com/photo1.jpg"],
  pixKey: "example-pix-key",
  recipient: "Community Center",
});

const makeReadByIdCampaignUseCase = () => {
  class ReadByIdCampaignUseCase implements IReadCampaignByIdUseCase {
    async execute(campaignId: string): Promise<IReadByIdReturn> {
      return {
        datas: {
          campaign,
        },
      };
    };
  };

  const readByIdCampaignUseCase = new ReadByIdCampaignUseCase();

  return {
    readByIdCampaignUseCase,
  };
};

const makeReadByIdCampaignController = () => {
  const { readByIdCampaignUseCase } = makeReadByIdCampaignUseCase();
  const readByIdCampaignController = new ReadByIdCampaignController(readByIdCampaignUseCase);

  return {
    readByIdCampaignController,
  };
};

describe("ReadByIdCampaignController", () => {
  it ('should return a campaign at campaignId', async () => {
    const { readByIdCampaignController } = makeReadByIdCampaignController();

    const { body, statusCode } = await readByIdCampaignController.handle({
      params: {
        campaignId,
      },
    });

    expect(statusCode).toBe(200);
    expect(body.errors).toBeFalsy();
    expect(body.datas?.campaign).toHaveProperty("_id");
    expect(body.datas?.campaign.id).toBe(campaignId);
  });

  it("should return an error when useCase fails", async () => {
    const readByIdCampaignController = new ReadByIdCampaignController({
      execute: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    });

    const { statusCode, body } = await readByIdCampaignController.handle({
      params: {
        campaignId: 'anyCampaignId',
      },
    });
    
    expect(statusCode).toBe(500);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Unexpected error");
  });
});
