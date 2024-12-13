import { ICampaignModel } from "../../../../infra/models/Campaign";
import { ICategoryModel } from "../../../../infra/models/Category";
import { ICommentModel } from "../../../../infra/models/Comment";
import { IDonationModel } from "../../../../infra/models/Donation";
import { IHistoryDonationModel } from "../../../../infra/models/HistoryDonation";
import { IUserModel } from "../../../../infra/models/User";
import { Campaign as CampaignEntity } from "../../../entities/Campaign";
import { Category as CategoryEntity } from "../../../entities/Category";
import { Comment as CommentEntity } from "../../../entities/Comment";
import { Donation as DonationEntity } from "../../../entities/Donation";
import { HistoryDonation as HistoryDonationEntity } from "../../../entities/HistoryDonation";
import { User as UserEntity } from "../../../entities/User";

export class MongoMappers {
  static mongoToObjUser (user: IUserModel): UserEntity {
    const { _id, email, password } = user;
    return new UserEntity({
      id: String(_id),
      email,
      password,
    });
  };

  static mongoToObjCampaign (campaign: ICampaignModel): CampaignEntity {
    const { 
      categoryId,
      userId, 
      description, 
      expectedValue, 
      expiresIn, 
      name, 
      photos, 
      pixKey, 
      recipient, 
      _id,
    } = campaign;

    return new CampaignEntity({
      categoryId: String(categoryId),
      description: description,
      expectedValue: expectedValue,
      expiresIn: expiresIn,
      name: name,
      photos: photos,
      pixKey: pixKey,
      recipient: recipient,
      userId: String(userId),
      id: String(_id),
      actualValue: campaign.actualValue
    });
  };

  static mongoToObjComment (comment: ICommentModel): CommentEntity {
    const { userId, campaignId, text, _id } = comment;
    
    return new CommentEntity({
      id: String(_id),
      userId: String(userId),
      campaignId: String(campaignId),
      text
    });
  };

  static mongoToObjCategory (category: ICategoryModel): CategoryEntity {
    const { _id, name } = category;
    return new CategoryEntity({
      name,
      id: String(_id),
    });
  };

  static mongoToObjDonation (donation: IDonationModel): DonationEntity {
    const {
      _id, 
      amount, 
      campaignId, 
      dateDonation,
      status, 
      userId 
    } = donation;

    return new DonationEntity({
      id: String(_id),
      amount,
      campaignId: String(campaignId),
      dateDonation,
      status,
      userId: String(userId),
    });
  };

  static mongoToObjHistoryDonation (historyDonation: IHistoryDonationModel): HistoryDonationEntity {
    const { _id, donationId, userId } = historyDonation;
    return new HistoryDonationEntity({
      id: String(_id),
      donationId: String(donationId),
      userId: String(userId),
    });
  };
};