import { formatDateString } from './formatDateString';

describe('Format Date String Helper', () => {
  it('Should format date accordingly', () => {
    const dateString = '2024-01-01T03:00:00Z';
    const formatted = formatDateString(dateString, 'dd/MMM/yy');
    expect(formatted).toEqual('01/jan/24');
  });
});
