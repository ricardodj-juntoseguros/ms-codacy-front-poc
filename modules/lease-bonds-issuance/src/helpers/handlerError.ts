export default function handleError(
  error: any,
  customMessage?: string,
): string {
  const errorMessage = customMessage || 'Houve um erro inesperado.';
  if (!error.data) return errorMessage;
  if (
    error.data &&
    error.data.data &&
    error.data.data.Message &&
    typeof error.data.data.Message === 'string'
  )
    return error.data.data.Message;
  if (
    error.data &&
    error.data.Message &&
    typeof error.data.Message === 'string'
  )
    return error.data.Message;
  if (
    error.data &&
    error.data.message &&
    typeof error.data.message === 'string'
  )
    return error.data.message;
  if (
    error.data &&
    error.data.ErrorDescription &&
    typeof error.data.ErrorDescription === 'string'
  )
    return error.data.ErrorDescription;
  if (error.data && typeof error.data === 'string') return error.data;
  if (error.data && error.data.data && typeof error.data === 'string')
    return error.data.data;
  if (error.data && error.data.code === 'UNDEFINED_0')
    return 'Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.';
  return errorMessage;
}
