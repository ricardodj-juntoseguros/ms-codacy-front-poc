import { objectArraysMerger } from './objectArraysMerger';

describe('Object Arrays Merger Lib', () => {
  it('Should merge two arraysof objects by distinct key correctly', () => {
    const arr1 = [
      { id: 1, value: 'Banana' },
      { id: 2, value: 'Apples' },
      { id: 3, value: 'Orange' },
    ];
    const arr2 = [
      { id: 2, value: 'Apples' },
      { id: 3, value: 'Orange' },
      { id: 4, value: 'Peaches' },
    ];
    const result = objectArraysMerger(arr1, arr2, 'id');
    const result2 = objectArraysMerger(arr1, arr2, 'value');
    expect(result.length).toBe(4);
    expect(result2.length).toBe(4);
  });
});
