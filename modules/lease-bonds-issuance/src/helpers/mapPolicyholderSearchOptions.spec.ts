import { PolicyholderSearchDTO } from '../application/types/dto';
import { mapPolicyholderSearchOptions } from './mapPolicyholderSearchOptions';

describe('MapPolicyholderSearchOptions Helper', () => {
  it('Should map PolicyholderSearchModel list correctly', () => {
    const mockArgs = {
      hasMore: false,
      records: [
        {
          id: 1,
          name: 'Tomador 1',
          federalId: '97837181000147',
        },
        {
          id: 2,
          name: 'Tomador 2',
          federalId: '51858633000176',
        },
        {
          id: 3,
          name: 'Tomador 3',
          federalId: '17608380000144',
        },
      ],
    } as PolicyholderSearchDTO;
    const result = mapPolicyholderSearchOptions(mockArgs);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(2);
    expect(result[2].id).toEqual(3);
    expect(result[0].value).toEqual('97837181000147');
    expect(result[1].value).toEqual('51858633000176');
    expect(result[2].value).toEqual('17608380000144');
    expect(result[0].label).toEqual('97.837.181/0001-47 - Tomador 1');
    expect(result[1].label).toEqual('51.858.633/0001-76 - Tomador 2');
    expect(result[2].label).toEqual('17.608.380/0001-44 - Tomador 3');
  });
});
