import { checkValidFederalId } from "./checkValidFederalId";

describe('checkValidFederalId', () => {
  it('should return true if the federalId is valid', () => {
    const federalId = '99999999999999';
    expect(checkValidFederalId(federalId)).toBe(true);
  });

  it('should return false if the federalId is invalid', () => {
    const federalId = '9999999999999';
    expect(checkValidFederalId(federalId)).toBe(false);
  });
});
