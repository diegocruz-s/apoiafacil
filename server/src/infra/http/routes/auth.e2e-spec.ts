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

describe('Auth[e2e]', () => {
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
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await queueController.close();
    await mongoose.connection.close();
  });

  it('should return a user and token', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: user.password });
    
    expect(response.status).toBe(200);
    expect(response.body.datas).toBeTruthy();
    expect(response.body.datas.user).toHaveProperty('_id');
    expect(response.body.datas.user.email).toBe(user.email);
    expect(response.body.datas.token).toBeTruthy();
  });

  it('should return a error when user is not found', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({ email: 'any_email@gmail.com', password: user.password });

    expect(response.status).toBe(422);
    expect(response.body.datas).toBeFalsy();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toBe('Authentication failed!');
  });

  it('should return a error when password is not match', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({ email: user.email, password: 'AnyPass@321' });

    expect(response.status).toBe(422);
    expect(response.body.datas).toBeFalsy();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toBe('Authentication failed!');
  });

  it('should return a error when datas is not provided[email]', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({ password: 'AnyPass@321' });

    expect(response.status).toBe(422);
    expect(response.body.datas).toBeFalsy();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toContain('email');
  });

  it('should return a error when datas is not provided[password]', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({ email: user.email });

    expect(response.status).toBe(422);
    expect(response.body.datas).toBeFalsy();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toContain('password');
  });

  it('should return a error when datas is not provided[all]', async () => {
    await createUser({
      email: user.email,
      password: user.password,
      environment: 'test',
    });

    const response = await request(appController.app)
      .post('/auth')
      .send({});

    expect(response.status).toBe(422);
    expect(response.body.datas).toBeFalsy();
    expect(response.body.errors.length).toBe(2);
    expect(response.body.errors[0]).toContain('email');
    expect(response.body.errors[1]).toContain('password');
  });
});