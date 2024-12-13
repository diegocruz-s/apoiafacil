import { Router } from "express";
import { loginFactoryController } from '../../../shared/factories/AuthFactoryController';

const routes = Router();
routes.post('/', async (req, res) => {
  const { loginController } = loginFactoryController();

  const { body, statusCode } = await loginController.handle({
    body: req.body,
  });

  return res.status(statusCode).json(body);

});

export {
  routes as authRoutes,
};