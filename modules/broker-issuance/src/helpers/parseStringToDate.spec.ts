import { parseStringToDate } from './parseStringToDate';

describe('ParseStringToDate Helper', () => {
  it('should convert string type to date', async () => {
    const dateString = parseStringToDate('01/01/1970');

    expect(dateString).toEqual(new Date(1970, 0, 1));
  });
});
