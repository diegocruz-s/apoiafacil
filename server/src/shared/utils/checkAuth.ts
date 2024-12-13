import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export interface IdUserVerify {
  id: string;
}

export const checkAuth: (request: Request, response: Response, next: NextFunction) => void = async (request, response, next) => {
  try {
    const authorization = request.headers.authorization;
    
    if (!authorization) {
      return response.status(422).json({
        errors: ['Access denied!'],
      });
    };

    const [_, token] = authorization.split(' ');

    if (!token) {
      return response.status(422).json({
        errors: ['Invalid token!'],
      });
    };

    const checkToken = jwt.verify(token, process.env.SECRET_TOKEN!) as IdUserVerify;

    if (checkToken) {
      request.userId = checkToken.id;
    };

    next();

  } catch (error: any) {    
    return response.status(500).json({
      errors: [error.message]
    })
  };
};