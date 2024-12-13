import { Campaign } from "./Campaign";
import { Category } from "./Category";
import { User } from "./User";

const generateUserAndCategoryMock = (
  { userId, categoryId }: { userId: string, categoryId: string }
) => {
  const user = new User({
    email: 'diego@example.com',
    password: 'Diego@123',
    id: userId,
  });

  const category = new Category({
    name: 'Example Category',
    id: categoryId,
  });


  return {
    user, category,
  };
};

describe('Campaign Entity', () => {
  it('should create a user when correct params', async () => {
    const { category, user } = generateUserAndCategoryMock({
      categoryId: 'idCategory',
      userId: 'idUser'
    });
    const datasUser = {
      name: 'Campaign Test',
      description: 'Any description for campaign',
      expectedValue: 10000,
      photos: ['image1.png', 'image2.png'],
      expiresIn: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 meses a frente
      pixKey: 'any_pix_key',
      recipient: 'John Doe',
      categoryId: category.id,
      userId: user.id,
    };

    const campaign = new Campaign(datasUser);
    const { errors, valid } = campaign.isValid();    

    expect(campaign).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(campaign.name).toBe(datasUser.name);
    expect(campaign.description).toBe(datasUser.description);
    expect(campaign.expectedValue).toBe(datasUser.expectedValue);
    expect(campaign.photos).toBe(datasUser.photos);
    expect(campaign.expiresIn).toBe(datasUser.expiresIn);
    expect(campaign.pixKey).toBe(datasUser.pixKey);
    expect(campaign.recipient).toBe(datasUser.recipient);
    expect(campaign.categoryId).toBe(datasUser.categoryId);
    expect(campaign.userId).toBe(datasUser.userId);
  });

  it('should return an error when datas user is not valid', async () => {
    const datasCampaign = {
      name: '',
      description: '',
      photos: [],
      expiresIn: new Date(), // Data inválida
      pixKey: '',
      recipient: '',
      categoryId: '',
      userId: '',
      expectedValue: 400, // Valor abaixo do mínimo
    };
  
    const campaign = new Campaign(datasCampaign);
    const { errors, valid } = campaign.isValid();
  
    const expectedErrors = [
      'Expected value must be at least 500!',
      'The campaign must be at least two weeks long',
      `Property name is not valid!`,
      `Property description is not valid!`,
      `Property pixKey is not valid!`,
      `Property recipient is not valid!`,
      `Property categoryId is not valid!`,
      `Property userId is not valid!`,
    ];
  
    expect(errors).toHaveLength(expectedErrors.length);
    expectedErrors.forEach((error) => expect(errors).toContain(error));
    expect(valid).toBeFalsy();
  });
});