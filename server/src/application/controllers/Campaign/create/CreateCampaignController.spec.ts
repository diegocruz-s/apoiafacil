import { randomUUID } from "crypto";
import { Campaign, IDatasCampaign } from "../../../../domain/entities/Campaign";
import { IReturnCreateCampaign } from "../../../interfaces/IReturnCreateCampaign";
import { ICreateCampaignUseCase } from "../../../useCases/campaign/create/protocols";
import { CreateCampaignController } from "./CreateCampaignController";

const makeFakeCampaign = (): IDatasCampaign => ({
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

const makeFakeCreateCampaignUseCase = () => {
  class CreateCampaignUseCase implements ICreateCampaignUseCase {
    async execute(datas: IDatasCampaign): Promise<IReturnCreateCampaign> {
      return {
        datas: {
          campaign: new Campaign(makeFakeCampaign()),
          qrcode: 'any_qrcode'
        },
      };
    };
  };

  const createCampaignUseCase = new CreateCampaignUseCase();
  return { createCampaignUseCase };
};

const makeFakeCreateCampaignController = () => {
  const { createCampaignUseCase } = makeFakeCreateCampaignUseCase();
  const createCampaignController = new CreateCampaignController(createCampaignUseCase);

  return { createCampaignController };
};

const makeFakeCreateCampaignUseCaseFailed = () => {
  class CreateCampaignUseCase implements ICreateCampaignUseCase {
    async execute(datas: IDatasCampaign): Promise<IReturnCreateCampaign> {
      return {
        errors: ["Error creating campaign!"],
      };
    }
  }

  const createCampaignUseCase = new CreateCampaignUseCase();
  return { createCampaignUseCase };
};

const makeFakeCreateCampaignControllerFailed = () => {
  const { createCampaignUseCase } = makeFakeCreateCampaignUseCaseFailed();
  const createCampaignController = new CreateCampaignController(createCampaignUseCase);

  return { createCampaignController };
};

describe("CreateCampaignController", () => {
  it("should return the created campaign and status code 200", async () => {
    const { createCampaignController } = makeFakeCreateCampaignController();
    const datasCampaign = makeFakeCampaign();

    const { statusCode, body } = await createCampaignController.handle({ body: datasCampaign });

    expect(statusCode).toBe(200);
    expect(body.errors).toBeFalsy();
    expect(body.datas?.campaign).toHaveProperty("_id");
    expect(body.datas?.campaign.name).toBe(datasCampaign.name);
  });

  it("should return an error when description is too short", async () => {
    const { createCampaignController } = makeFakeCreateCampaignController();
    const datasCampaign = { ...makeFakeCampaign(), description: "Too short" };

    const { statusCode, body } = await createCampaignController.handle({ body: datasCampaign });

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain("description");
  });

  it("should return an error when expectedValue is below the minimum", async () => {
    const { createCampaignController } = makeFakeCreateCampaignController();
    const datasCampaign = { ...makeFakeCampaign(), expectedValue: 10 };

    const { statusCode, body } = await createCampaignController.handle({ body: datasCampaign });
    
    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain("expectedValue");
  });

  it("should return an error when multiple fields are invalid", async () => {
    const { createCampaignController } = makeFakeCreateCampaignController();
    const datasCampaign = { 
      ...makeFakeCampaign(), 
      description: "Short", 
      expectedValue: 10,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Less than two weeks
    };

    const { statusCode, body } = await createCampaignController.handle({ body: datasCampaign });

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBeGreaterThanOrEqual(2);
  });

  it("should return an error when useCase fails", async () => {
    const { createCampaignController } = makeFakeCreateCampaignControllerFailed();
    const datasCampaign = makeFakeCampaign();

    const { statusCode, body } = await createCampaignController.handle({ body: datasCampaign });

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Error creating campaign!");
  });

  it("should return a 500 error on unexpected exception", async () => {
    const createCampaignController = new CreateCampaignController({
      execute: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    });

    const { statusCode, body } = await createCampaignController.handle({ body: makeFakeCampaign() });

    expect(statusCode).toBe(500);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe("Unexpected error");
  });
});
