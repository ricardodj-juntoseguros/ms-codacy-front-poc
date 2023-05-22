import { AnyObjectSchema, ValidationError } from 'yup';
import {
  ValidationErrorModel,
  ValidationModel,
} from '../../../application/types/model';
import { VALIDATION_MESSAGES } from '../../../constants';

export function useValidate() {
  const validate = async <T>(
    validationSchema: AnyObjectSchema,
    data: T,
  ): Promise<ValidationModel> => {
    const response = await validationSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        return {
          isValidForm: true,
          errors: {},
        };
      })
      .catch(errors => {
        const initialValue = {};
        const filteredErrors = errors.inner.reduce(
          (
            previousErrorList: ValidationErrorModel,
            currentError: ValidationError,
          ) => {
            const { path, type } = currentError;

            if (!path || !type) {
              return previousErrorList;
            }
            const paramName = path.substring(
              path.indexOf('.') + 1,
              path.length,
            );

            if (path in previousErrorList) {
              return {
                ...previousErrorList,
                [paramName]: [
                  ...previousErrorList[paramName],
                  (VALIDATION_MESSAGES as any)[type] ||
                    VALIDATION_MESSAGES.required,
                ],
              };
            }
            return Object.assign(previousErrorList, {
              [paramName]: [
                (VALIDATION_MESSAGES as any)[type] ||
                  VALIDATION_MESSAGES.required,
              ],
            });
          },
          initialValue,
        );

        return {
          isValidForm: false,
          errors: filteredErrors,
        };
      });

    return response;
  };

  return validate;
}
