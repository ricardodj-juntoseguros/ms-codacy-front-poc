import { useOptionsMapper } from './useOptionsMapper';

describe('useOptionsMapper', () => {
  it('Should return mapped options accordingly', () => {
    const optionsToMap = [
      { id: 1, description: 'Apple' },
      { id: 2, description: 'Orange' },
      { id: 3, description: 'Grapes' },
      { id: 4, description: 'Banana' },
    ];
    const mockSelectCallback = jest.fn();

    const result = useOptionsMapper(
      optionsToMap,
      'description',
      undefined,
      'id',
      mockSelectCallback,
    );
    result.selectOption(result.mappedOptions[0]);
    expect(mockSelectCallback).toHaveBeenCalledWith(optionsToMap[0]);
  });
});
