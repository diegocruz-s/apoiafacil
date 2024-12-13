import { config } from 'dotenv'
config()
import { NextFunction, Request, Response } from 'express'
import { checkAuth } from './checkAuth'
import { randomUUID } from 'crypto'
import { sign } from 'jsonwebtoken'

describe('Authorization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it ('should call next function to request on succefully authentication', async () => {
    const userIdTest = randomUUID();
    const userToken = sign({
      id: userIdTest
    }, process.env.SECRET_TOKEN!, {
        expiresIn: '7d'
    });
    mockRequest = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    checkAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should return a error when headers request is empty', async () => {
    const expectResponse = {
        errors: ['Access denied!'],
    };
    mockRequest = {
        headers: {},
    };
   checkAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });

  it('should return a error when authorization is invalid', () => {
    const expectResponse = {
        errors: ['Invalid token!'],
    };

    mockRequest = {
        headers: {
            authorization: "invalid"
        },
    };

    checkAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFunction).toHaveBeenCalledTimes(0);

  });

  it('should return a error when verify token as secret is failed', () => {
    const expectResponse = {
      errors: ['invalid signature'],
    };

    const anySecretToken = 'sdfdffd2545353324@#$%dfb';
    const userId = randomUUID();
    const token = sign({
        id: userId
    }, anySecretToken, {
        expiresIn: '7d'
    });
    mockRequest = {
        headers: {
            authorization: `Bearer ${token}`
        },
    };
    checkAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });
});