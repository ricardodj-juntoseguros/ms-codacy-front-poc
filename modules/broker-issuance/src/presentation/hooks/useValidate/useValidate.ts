import { AnyObjectSchema, ValidationError } from 'yup';
import { useDispatch } from 'react-redux';
import { validationActions } from '../../../application/features/validation/ValidationSlice';
import {
  ValidationErrorModel,
  ValidationTypesEnum,
} from '../../../application/types/model';
import { VALIDATION_MESSAGES } from '../../../constants';

export function useValidate() {
  const dispatch = useDispatch();

  const validate = async <T>(
    validationSchema: AnyObjectSchema,
    data: T,
    validationType = ValidationTypesEnum.full,
    validationFields?: string[],
    showRequiredError = true,
  ): Promise<boolean> => {
    let schema = validationSchema;
    const isPartial =
      validationType === ValidationTypesEnum.partial && validationFields;
    if (isPartial) {
      schema = validationSchema.pick(validationFields);
    }
    let result = false;

    await schema
      .validate(data, { abortEarly: false })
      .then(() => {
        if (isPartial) {
          validationFields.forEach(field => {
            dispatch(validationActions.removeErrorMessage(field));
          });
          result = true;
        } else {
          dispatch(validationActions.clearErrorMessages());
          result = true;
        }
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

            if (
              (type === 'required' || type === 'typeError') &&
              !showRequiredError
            ) {
              return previousErrorList;
            }

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

        if (Object.keys(filteredErrors).length === 0) {
          if (isPartial) {
            validationFields.forEach(field => {
              dispatch(validationActions.removeErrorMessage(field));
            });
            result = true;
          }
        } else {
          dispatch(validationActions.setErrorMessages(filteredErrors));
          result = false;
        }
      });

    return result;
  };

  return validate;
}
