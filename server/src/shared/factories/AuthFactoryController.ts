import { LoginController } from "../../application/controllers/Auth/AuthController";
import { LoginUserUseCase } from "../../application/useCases/Auth/AuthUseCase";
import { MongoAuthRepository } from "../../domain/repositories/mongo/Auth/MongoAuthRepository";
import { queueController } from "../../infra/lib/Queue";
import { CompareHashBcrypt } from "../utils/CompareHashBcrypt";
import { GenerateTokenJWT } from "../utils/GenerateTokenJwt";

export function loginFactoryController () {
  const loginRepository = new MongoAuthRepository();
  const compareHashBcrypt = new CompareHashBcrypt();
  const generateTokenJWT = new GenerateTokenJWT();

  const loginUserUseCase = new LoginUserUseCase(
    loginRepository, compareHashBcrypt, generateTokenJWT, queueController
  );

  const loginController = new LoginController(loginUserUseCase);

  return {
    loginController,
  };
};
