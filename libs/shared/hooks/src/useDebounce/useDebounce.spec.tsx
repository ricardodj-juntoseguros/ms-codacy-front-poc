import '@testing-library/jest-dom';
import { waitFor, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should call callback function after timer passes', async () => {
    const mockFn = jest.fn();
    renderHook(() => useDebounce(mockFn, 1000, []));
    jest.runAllTimers();
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
