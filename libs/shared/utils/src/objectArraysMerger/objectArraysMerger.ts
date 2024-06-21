export function objectArraysMerger<T>(
  first: T[],
  second: T[],
  uniqueKey: string,
) {
  const concatArray = first.concat(second);
  const uniquesMap = new Map<any, T>();
  concatArray.forEach(each => {
    uniquesMap.set(each[uniqueKey as keyof T], each);
  });
  return Array.from(uniquesMap.values());
}
