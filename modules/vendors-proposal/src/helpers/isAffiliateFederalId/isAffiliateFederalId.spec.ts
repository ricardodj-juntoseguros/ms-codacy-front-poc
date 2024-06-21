import { isAffiliateFederalId } from './isAffiliateFederalId';

describe('isAffiliateFederalId helper', () => {
  it('Should return true if provided value digits substring not equal 0001', () => {
    const result = isAffiliateFederalId('45.543.915/0050-60');
    expect(result).toBeTruthy();
  });

  it('Should return false if provided value digits substring equal 0001', () => {
    const result = isAffiliateFederalId('45.543.915/0001-60');
    expect(result).toBeFalsy();
  });

  it('Should return false if provided value stripped lenght is not 14', () => {
    const result = isAffiliateFederalId('45.543.915/0001-602');
    expect(result).toBeFalsy();
  });
});
