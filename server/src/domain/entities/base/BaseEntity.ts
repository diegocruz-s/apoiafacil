export abstract class BaseEntity {
  isValid(): { errors: (string | null)[]; valid: boolean } {
    const keysProperties = Object.getOwnPropertyNames(this);

    const errorsInProperties = keysProperties
      .map(key =>
        !!this[key as keyof this]
        || this[key as keyof this] === 0
          ? null
          : `Property ${key} is not valid!`
      )
      .filter(value => !!value);

    return {
      errors: errorsInProperties,
      valid: errorsInProperties.length === 0,
    };
  };
  
};