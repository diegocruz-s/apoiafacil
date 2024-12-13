import dotenv from 'dotenv';
dotenv.config({ path: '.env.testing' });
import request from 'supertest';
import mongoose from 'mongoose';

import { appController } from '../../../app';
import { createUser } from '../../database/seed';
import { UserModel } from '../../models/User';
import { connectionDatabaseTest } from '../../../tests/e2e/ConnectionDatabaseTest';
import { queueController } from '../../lib/Queue';
import { CampaignModel } from '../../models/Campaign';
import { DonationModel } from '../../models/Donation';

const user = {
  email: 'diego@gmail.com',
  password: 'Diego@123',
};

describe('Payment[e2e]', () => {
  beforeAll(async () => {
    await connectionDatabaseTest();
  });

  beforeEach(async () => {
    await DonationModel.deleteMany({});
    await CampaignModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await queueController.close();
    await mongoose.connection.close();
  });

  it('should return a donation when datas as correct', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password });
    
    const datasCampaign = {
      name: "Campaign Test",
      description: "Descrição aleatória de uma campanha de teste qualquer!",
      expectedValue: 5000,
      categoryId: "60d5f9d46b81d2041085d5b6",
      photos: ["image1.png", "image2.png"],
      pixKey: "111.111.111-11",
      recipient: "Maria do Bairro",
      expiresIn: "2024-12-31T23:59:59Z"
    };
    const { body: bodyCampaign } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign)
      .expect(200);
      
    const datasDonation = {
      amount: 50,
    };
    const { body, status } = await request(appController.app)
      .post(`/payment/${bodyCampaign.datas.campaign._id}`)
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasDonation);

    const { body: bodyCampaignId, } = await request(appController.app)
      .get(`/campaign/${bodyCampaign.datas.campaign._id}`)
      .expect(200);
      
    expect(body.errors).toBeFalsy();
    expect(body.datas).toBeTruthy();
    expect(body.datas).toHaveProperty('donationId');
    expect(body.datas.amount).toBe(datasDonation.amount);
    expect(body.datas.campaignId).toBe(bodyCampaign.datas.campaign._id);
    expect(body.datas.message).toBe('Payment successful!');
    expect(bodyCampaignId.datas.campaign.actualValue).toBe(50)
  });

  it('should return a valid actualValue of the campaign after multiple donations', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });
  
    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password });
  
    const campaignData = {
      name: "Campaign Test",
      description: "Descrição aleatória de uma campanha de teste qualquer!",
      expectedValue: 5000,
      categoryId: "60d5f9d46b81d2041085d5b6",
      photos: ["image1.png", "image2.png"],
      pixKey: "111.111.111-11",
      recipient: "Maria do Bairro",
      expiresIn: "2024-12-31T23:59:59Z"
    };
    const { body: bodyCampaign } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${bodyLogin.datas.token}` })
      .send(campaignData)
      .expect(200);
  
    const donationAmounts = [50, 100, 20];
    let cumulativeValue = 0;
  
    for (const amount of donationAmounts) {
      const { body: donationResponse, status } = await request(appController.app)
        .post(`/payment/${bodyCampaign.datas.campaign._id}`)
        .set({ authorization: `Bearer ${bodyLogin.datas.token}` })
        .send({ amount });
  
      expect(status).toBe(200);
      expect(donationResponse.errors).toBeFalsy();
      expect(donationResponse.datas.amount).toBe(amount);
  
      cumulativeValue += amount;
  
      const { body: campaignStatus } = await request(appController.app)
        .get(`/campaign/${bodyCampaign.datas.campaign._id}`)
        .expect(200);
  
      expect(campaignStatus.datas.campaign.actualValue).toBe(cumulativeValue);
    }
  
    const { body: finalCampaignStatus } = await request(appController.app)
      .get(`/campaign/${bodyCampaign.datas.campaign._id}`)
      .expect(200);
  
    const totalValue = donationAmounts.reduce((prev, curr) => prev + curr, 0);
    expect(finalCampaignStatus.datas.campaign.actualValue).toBe(totalValue);
  });
  

  it('should return a error when amount is not provided', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password });
    
    const datasCampaign = {
      name: "Campaign Test",
      description: "Descrição aleatória de uma campanha de teste qualquer!",
      expectedValue: 5000,
      categoryId: "60d5f9d46b81d2041085d5b6",
      photos: ["image1.png", "image2.png"],
      pixKey: "111.111.111-11",
      recipient: "Maria do Bairro",
      expiresIn: "2024-12-31T23:59:59Z"
    };
    const { body: bodyCampaign } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign)
      .expect(200);
      
    const datasDonation = {};
    const { body, status } = await request(appController.app)
      .post(`/payment/${bodyCampaign.datas.campaign._id}`)
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasDonation);

    expect(body.errors).toBeTruthy();
    expect(body.datas).toBeFalsy();
    expect(body.errors[0]).toBe('amount: Required');
  });

  it('should return an error when donation amount is invalid', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });
  
    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password });
  
    const datasCampaign = {
      name: "Campaign Test",
      description: "Descrição aleatória de uma campanha de teste qualquer!",
      expectedValue: 5000,
      categoryId: "60d5f9d46b81d2041085d5b6",
      photos: ["image1.png", "image2.png"],
      pixKey: "111.111.111-11",
      recipient: "Maria do Bairro",
      expiresIn: "2024-12-31T23:59:59Z"
    };
    const { body: bodyCampaign } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${bodyLogin.datas.token}` })
      .send(datasCampaign)
      .expect(200);
  
    const invalidAmounts = [-10, 0];
  
    for (const amount of invalidAmounts) {
      const { body, status } = await request(appController.app)
        .post(`/payment/${bodyCampaign.datas.campaign._id}`)
        .set({ authorization: `Bearer ${bodyLogin.datas.token}` })
        .send({ amount });
  
      expect(status).toBe(422);
      expect(body.errors).toBeTruthy();
      expect(body.errors[0]).toBe('amount: Amount must be greater than zero');
    };
  });
  
  it('should return an error when no authorization token is provided', async () => {
    const datasDonation = {
      amount: 50,
    };
  
    const { body, status } = await request(appController.app)
      .post(`/payment/any_campaign_id`)
      .send(datasDonation);
  
    expect(status).toBe(422);
    expect(body.errors).toBeTruthy();
    expect(body.errors[0]).toBe('Access denied!');
  });
});
