import { parseDateToString } from './parseDateToString';

describe('ParseDateToString Helper', () => {
  it('should convert date type to string', async () => {
    const dateString = parseDateToString(new Date(1970, 0, 1));

    expect(dateString).toEqual('01/01/1970');
  });
});
