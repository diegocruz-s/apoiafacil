import dotenv from 'dotenv';
dotenv.config({ path: '.env.testing' });
import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';

import { appController } from '../../../app';
import { createUser } from '../../database/seed';
import { UserModel } from '../../models/User';
import { connectionDatabaseTest } from '../../../tests/e2e/ConnectionDatabaseTest';
import { queueController } from '../../lib/Queue';
import { SES } from 'aws-sdk';
import { CampaignModel } from '../../models/Campaign';

const user = {
  email: 'diego@gmail.com',
  password: 'Diego@123',
};
const fixedResponseSES = {
  datasTest: 'Email Stub Sinon',
};
const fixedResponseQueue = {
  datasTest: 'Queue Stub Sinon',
};

describe('CreateCampaign[e2e]', () => {  
  beforeAll(async () => {
    const ses = new SES();
    sinon.stub(ses, 'sendEmail').returns({
      promise: () => Promise.resolve(fixedResponseSES),
    } as any);
    sinon.stub(queueController, 'add').returns({
      promise: () => Promise.resolve(fixedResponseQueue),
    } as any);

    await connectionDatabaseTest();
  });

  beforeEach(async () => {
    await CampaignModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await queueController.close();
    await mongoose.connection.close();
  });

  it('should return campaign when datas as correct', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password })
      .expect(200);

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
    const { body, status } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign);
    
    expect(status).toBe(200);
    expect(body.datas).toHaveProperty('campaign');
    expect(body.datas).toHaveProperty('qrcode');
    expect(body.datas.campaign).toHaveProperty('_id');
    expect(body.datas.campaign).toHaveProperty('createdAt');
    expect(body.datas.campaign).toHaveProperty('expiresIn');
    expect(body.datas.campaign.userId).toBe(bodyLogin.datas.user._id);
    expect(body.datas.campaign.categoryId).toBe(datasCampaign.categoryId);
    expect(body.datas.campaign.name).toBe(datasCampaign.name);
    expect(body.datas.campaign.description).toBe(datasCampaign.description);
    expect(body.datas.campaign.favoritesList.length).toBe(0);
    expect(body.datas.campaign.expectedValue).toBe(datasCampaign.expectedValue);
    expect(body.datas.campaign.actualValue).toBe(0);
    expect(body.datas.campaign.photos[0]).toBe(datasCampaign.photos[0]);
    expect(body.datas.campaign.photos[1]).toBe(datasCampaign.photos[1]);
    expect(body.datas.campaign.status).toBe('active');
    expect(body.datas.campaign.pixKey).toBe(datasCampaign.pixKey);
  });

  it('should return array error when multiple datas is invalid', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const datasCampaign = {};
    const { body, status } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign);
    
    const expectedErrors = [
      "categoryId: Required",
      "description: Required",
      "expectedValue: Expected number, received nan",
      "expiresIn: Invalid date",
      "name: Required",
      "photos: Required",
      "pixKey: Required",
      "recipient: Required"
    ];

    expect(status).toBe(422);
    expect(body.datas).toBeFalsy();
    expect(body.errors).toBeTruthy();

    for (let index=0; index<expectedErrors.length; index++) {
      expect(body.errors.includes(expectedErrors[index])).toBe(true);
    };    
  });

  it('should return error when no authorization token is provided', async () => {
    const datasCampaign = {};
  
    const { body, status } = await request(appController.app)
      .post('/campaign')
      .send(datasCampaign);
  
    expect(status).toBe(422);
    expect(body.errors).toBeTruthy();
    expect(body.errors[0]).toBe('Access denied!');

  });

  it('should return error for invalid field values', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const datasCampaign = {
      name: "",
      description: 123,
      expectedValue: "not_a_number",
      categoryId: "",
      photos: "not_an_array",
      pixKey: "",
      recipient: "",
      expiresIn: "not_a_date",
    };

    const { body, status } = await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign);
    
    const expectedErrors = [
      "description: Expected string, received number",
      "expectedValue: Expected number, received nan",
      "expiresIn: Invalid date",
      "name: String must contain at least 5 character(s)",
      "photos: Expected array, received string"
    ];

    expect(status).toBe(422);
    for (let index=0; index<expectedErrors.length; index++) {
      expect(body.errors.includes(expectedErrors[index])).toBe(true);
    }; 
  });
  
  it('should verify queueController.add is called when creating a campaign', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const { body: bodyLogin } = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const queueSpy = jest.spyOn(queueController, 'add');

    const datasCampaign = {
      name: "Campaign Test",
      description: "Descrição aleatória de uma campanha de teste qualquer!",
      expectedValue: 5000,
      categoryId: "60d5f9d46b81d2041085d5b6",
      photos: ["image1.png", "image2.png"],
      pixKey: "111.111.111-11",
      recipient: "John Doe",
      expiresIn: "2024-12-31T23:59:59Z",
    };

    await request(appController.app)
      .post('/campaign')
      .set({ authorization: `Bearer ${ bodyLogin.datas.token }` })
      .send(datasCampaign)
      .expect(200);
    
    expect(queueSpy).toHaveBeenCalledTimes(1);
  
  });
});