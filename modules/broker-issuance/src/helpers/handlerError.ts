export default function handleError(error: any) {
  const errorMessage = 'Houve um erro inesperado.';
  if (!error.data) return errorMessage;
  if (error.data && error.data.data && error.data.data.Message) return error.data.data.Message;
  if (error.data && error.data.Message) return error.data.Message;
  if (error.data && error.data.message) return error.data.message;
  if (error.data && error.data.ErrorDescription) return error.data.ErrorDescription;
  if (error.data) return error.data;
  return errorMessage;
}
