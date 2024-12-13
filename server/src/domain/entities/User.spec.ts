import { User } from "./User";

describe('User Entity', () => {
  it('should create a user when correct params', async () => {
    const datasUser = {
      email: 'any@email.com',
      password: 'Any@Pass',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();
  
    expect(user).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(user.email).toBe(datasUser.email);
    expect(user.password).toBe(datasUser.password);
  });

  it('should return a error when datas user is not valid', async () => {
    const datasUser = {
      email: '',
      password: '',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();
  
    expect(errors.length).toBe(2);
    for (let i=0; i<Object.getOwnPropertyNames(datasUser).length; i++) {
      expect(errors).toContain(
        `Property ${Object.keys(datasUser)[i]} is not valid!`
      );
    };
    expect(valid).toBeFalsy();
    
  });
});