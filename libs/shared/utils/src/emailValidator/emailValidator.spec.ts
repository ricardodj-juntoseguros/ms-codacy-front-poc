import { emailValidator } from './emailValidator';

describe('Email Validator Lib', () => {
  it('Should return true if provided value is a valid email', () => {
    const result = emailValidator('teste@mail.com');
    expect(result).toBeTruthy();
  });

  it('Should return false if provided value is not a valid email', () => {
    const result = emailValidator('aaabbb.ccc');
    expect(result).toBeFalsy();
  });
});
