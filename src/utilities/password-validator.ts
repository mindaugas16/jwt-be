import PasswordValidator from 'password-validator';

const minLength = 8;
const maxLength = 100;

export const validate = (password: string): boolean | string[] => {
  const schema = new PasswordValidator();

  schema
    .is().min(minLength)
    .is().max(maxLength)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols();

  return schema.validate(password, { list: true });
};

export const convertErrorMessage = (errors: string[]): string[] => {
  if (errors && Array.isArray(errors) && errors.length) {
    return errors.reduce((acc: string[], error: string) => {
      switch (error) {
        case 'min':
          acc.push(`Minimum length ${ minLength }`);
          break;
        case 'max':
          acc.push(`Maximum length ${ maxLength }`);
          break;
        case 'uppercase':
          acc.push(`Must have uppercase letters`);
          break;
        case 'lowercase':
          acc.push(`Must have lowercase letters`);
          break;
        case 'digits':
          acc.push(`Must have digits`);
          break;
        case 'symbols':
          acc.push(`Must have symbols`);
          break;
      }

      return acc;
    }, []);
  }
  return [];
};
