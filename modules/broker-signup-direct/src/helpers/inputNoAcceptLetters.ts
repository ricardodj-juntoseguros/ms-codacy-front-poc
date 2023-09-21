export function inputNoAcceptLetters(value: string): string {
  const reg = new RegExp('^[0-9]+$')
  if (!value) return '';
  if(!reg.test(value)) {
    return value.slice(0,-1)
  }
  return value
}
