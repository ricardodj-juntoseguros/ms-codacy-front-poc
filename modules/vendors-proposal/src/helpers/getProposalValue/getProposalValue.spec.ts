import { getProposalValue } from './getProposalValue';

describe('getProposalValue', () => {
  it('should format a number to currency pattern', () => {
    const value = getProposalValue(1000, 80);

    expect(value).toEqual(800);
  });
});
