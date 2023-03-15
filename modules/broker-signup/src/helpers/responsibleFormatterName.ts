export function responsibleFormatterName(value: string): string {
  const reg = new RegExp(/^((\b[A-zÀ-ú']{0,40}\b)\s*){1,2}$/gm);
  if (!value) return '';
  if(!reg.test(value)) {
    return value.slice(0,-1)
  }
  return value
}
