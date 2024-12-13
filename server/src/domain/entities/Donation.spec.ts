import { StatusEnum } from "./base/StatusEnum";
import { Campaign } from "./Campaign";
import { Donation, IDatasDonation } from "./Donation";
import { User } from "./User";

const generateUserAndCampaignMock = (
  { userId, campaignId, categoryId }: { userId: string, campaignId: string, categoryId: string }
) => {
  const user = new User({
    email: 'diego@example.com',
    password: 'Diego@123',
    id: userId,
  });

  const campaign = new Campaign({
    name: 'Test',
    description: 'Any description for campaign',
    expectedValue: 10000,
    photos: ['image1.png', 'image2.png'],
    expiresIn: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 meses a frente
    pixKey: 'any_pix_key',
    recipient: 'John Doe',
    categoryId: categoryId,
    userId: user.id,
    id: campaignId,
  });

  return {
    user, campaign,
  };
};

describe('Donation Entity', () => {
  it('should create a user when correct params', async () => {
    const { campaign, user } = generateUserAndCampaignMock({
      campaignId: 'campaignId', categoryId: 'categoryId', userId: 'userId',
    });

    const datasDonation: IDatasDonation = {
      campaignId: campaign.id,
      userId: user.id,
      amount: 100,
      dateDonation: new Date(),
      status: StatusEnum.COMPLETED,
    };

    const donation = new Donation(datasDonation);
    const { errors, valid } = donation.isValid();    
  
    expect(donation).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(donation.amount).toBe(datasDonation.amount);
    expect(donation.campaignId).toBe(datasDonation.campaignId);
    expect(donation.userId).toBe(datasDonation.userId);
    expect(donation.dateDonation).toBe(datasDonation.dateDonation);
    expect(donation.status).toBe(datasDonation.status);
  });

  it('should return a error when datas user is not valid', async () => {
    const datasDonation: IDatasDonation = {
      campaignId: '',
      userId: '',
      dateDonation: new Date(),
      amount: 100,
      status: StatusEnum.COMPLETED,
    };

    const donation = new Donation(datasDonation);
    const { errors, valid } = donation.isValid();   
  
    expect(errors.length).toBe(2);
    for (let i=0; i<Object.getOwnPropertyNames(datasDonation).length; i++) {
      
      const skipFields = ['dateDonation', 'amount', 'status']
      if (skipFields.includes(Object.keys(datasDonation)[i])) continue;

      expect(errors).toContain(
        `Property ${Object.keys(datasDonation)[i]} is not valid!`
      );
    };
    expect(valid).toBeFalsy();
    
  });
});
