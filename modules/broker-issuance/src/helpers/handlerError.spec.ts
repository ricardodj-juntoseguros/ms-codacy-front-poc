import handleError from "./handlerError";

describe('handlerError', () => {
  it('should return the error message data -> data -> Message', () => {
    const error = {
      data: {
        data: {
          Message: 'error message',
        },
      },
    };
    expect(handleError(error)).toBe('error message');
  });

  it('should return the error message data -> Message', () => {
    const error = {
      data: {
        Message: 'error message',
      },
    };
    expect(handleError(error)).toBe('error message');
  });

  it('should return the error message data -> message', () => {
    const error = {
      data: {
        message: 'error message',
      },
    };
    expect(handleError(error)).toBe('error message');
  });

  it('should return the error message data -> ErrorDescription', () => {
    const error = {
      data: {
        ErrorDescription: 'error message',
      },
    };
    expect(handleError(error)).toBe('error message');
  });

  it('should return the error message data', () => {
    const error = {
      data: 'error message',
    };
    expect(handleError(error)).toBe('error message');
  });

  it('should return the error message default error', () => {
    const error = {
      error: 'error message',
    };
    expect(handleError(error)).toBe('Houve um erro inesperado.');
  });
});
