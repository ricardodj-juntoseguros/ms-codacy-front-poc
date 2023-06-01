/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: any[],
) {
  useEffect(() => {
    const timerFunction = setTimeout(callback, delay);
    return () => clearTimeout(timerFunction);
  }, dependencies);
}
