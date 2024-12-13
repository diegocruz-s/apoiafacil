import { StatusEnum } from "./base/StatusEnum";
import { generateUserAndCampaignMock } from "./Comment.spec";
import { Donation } from "./Donation";
import { HistoryDonation } from "./HistoryDonation";

const generateUserAndDonationMock = (
  { userId, donationId }: { donationId: string, userId: string }
) => {
  const { campaign, user } = generateUserAndCampaignMock({
    campaignId: 'campaignId', categoryId: 'categoryId', userId,
  });

  const donation = new Donation({
    campaignId: campaign.id,
    userId: user.id,
    amount: 100,
    dateDonation: new Date(),
    transactionId: 'anyTransactionId',
    status: StatusEnum.COMPLETED,
    id: donationId,
  });

  return {
    donation, user,
  };
};

describe('HistoryDonation Entity', () => {
  it('should create a user when correct params', async () => {
    const { donation, user } = generateUserAndDonationMock({
      donationId: 'donationId', userId: 'userId',
    });

    const datasHistoryDonation = {
      donationId: donation.id,
      userId: user.id,
      id: donation.id,
    };

    const historyDonation = new HistoryDonation(datasHistoryDonation);
    const { errors, valid } = historyDonation.isValid();
  
    expect(historyDonation).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(historyDonation.donationId).toBe(datasHistoryDonation.donationId);
    expect(historyDonation.userId).toBe(datasHistoryDonation.userId);
  });

  it('should return a error when datas user is not valid', async () => {
    const datasHistoryDonation = {
      donationId: '',
      userId: '',
    };

    const historyDonation = new HistoryDonation(datasHistoryDonation);
    const { errors, valid } = historyDonation.isValid();
  
    expect(errors.length).toBe(2);
    for (let i=0; i<Object.getOwnPropertyNames(datasHistoryDonation).length; i++) {
      expect(errors).toContain(
        `Property ${Object.keys(datasHistoryDonation)[i]} is not valid!`
      );
    };
    expect(valid).toBeFalsy();
    
  });
});