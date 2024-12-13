import { Campaign } from "./Campaign";
import { Comment, IDatasComment } from "./Comment";
import { User } from "./User";

export const generateUserAndCampaignMock = (
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

describe('Comment Entity', () => {
  it('should create a user when correct params', async () => {
    const { campaign, user } = generateUserAndCampaignMock({
      userId: 'userId', campaignId: 'campaignId', categoryId: 'categoryId',
    });

    const datasComment: IDatasComment = {
      text: 'Comentario Teste',
      campaignId: campaign.id,
      userId: user.id,

    };

    const comment = new Comment(datasComment);
    const { errors, valid } = comment.isValid();
  
    expect(comment).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(comment.campaignId).toBe(datasComment.campaignId);
    expect(comment.text).toBe(datasComment.text);
    expect(comment.userId).toBe(datasComment.userId);
  });

  it('should return a error when datas user is not valid', async () => {
    const datasComment = {
      text: '',
      userId: '',
      campaignId: '',
    };

    const comment = new Comment(datasComment);
    const { errors, valid } = comment.isValid();
  
    expect(errors.length).toBe(3);
    for (let i=0; i<Object.getOwnPropertyNames(datasComment).length; i++) {
      expect(errors).toContain(
        `Property ${Object.keys(datasComment)[i]} is not valid!`
      );
    };
    expect(valid).toBeFalsy();
    
  });
});