export function responsibleFormatterName(value: string): string {
  const reg = new RegExp("\\d");
  if (!value) return '';
  if(reg.test(value)) {
    return value.slice(0,-1)
  }
  return value
}
