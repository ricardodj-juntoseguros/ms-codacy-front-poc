export function phoneFormatter(valueToFormat: string): string {
  if (!valueToFormat) return '';
  if(valueToFormat.length > 15) {
    return valueToFormat.slice(0,-1)
  }
  valueToFormat = valueToFormat.replace(/\D/g,'')
  valueToFormat = valueToFormat.replace(/(\d{2})(\d)/,"($1) $2")
  valueToFormat = valueToFormat.replace(/(\d)(\d{4})$/,"$1-$2")
  return valueToFormat
}
