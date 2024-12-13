import { Category, IDatasCategory } from "./Category";

describe('Category Entity', () => {
  it('should create a category when correct params', async () => {
    const datasCategory: IDatasCategory = {
      name: 'Category Test'
    };

    const category = new Category(datasCategory);
    const { errors, valid } = category.isValid();
  
    expect(category).toHaveProperty('id');
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
    expect(category.name).toBe(datasCategory.name);
  });

  it('should return a error when datas category is not valid', async () => {
    const datasCategory = {
      name: '',
    };

    const category = new Category(datasCategory);
    const { errors, valid } = category.isValid();
  
    expect(errors.length).toBe(1);
    for (let i=0; i<Object.getOwnPropertyNames(datasCategory).length; i++) {
      expect(errors).toContain(
        `Property ${Object.keys(datasCategory)[i]} is not valid!`
      );
    };
    expect(valid).toBeFalsy();
    
  });
});