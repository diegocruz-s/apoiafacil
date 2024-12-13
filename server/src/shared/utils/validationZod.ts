import { Schema } from "zod";

export interface IParamaters {
  schema: Schema,
  body: unknown,
};

export interface IReturnValidation {
  isValid: boolean;
  errors?: string[];
};

export async function validation({ schema, body }: IParamaters): Promise<IReturnValidation> {
  try {
    await schema.parse(body);

    return { isValid: true };
  } catch (error: any) {
    const errors: string[] = [];

    error.issues.map((err: any) => {
      errors.push(`${err.path[0]}: ${err.message}`);
    });
    
    return {
      isValid: false,
      errors,
    };
  };
};