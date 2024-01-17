import { AnyObjectSchema, ValidationError } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectValidation,
  validationActions,
} from '../../../application/features/validation/ValidationSlice';
import {
  ValidationErrorModel,
  ValidationTypesEnum,
} from '../../../application/types/model';
import { VALIDATION_MESSAGES } from '../../../constants';

export function useValidate() {
  const dispatch = useDispatch();
  const validation = useSelector(selectValidation);

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

        if (validationType === ValidationTypesEnum.full) {
          // Remove error messages of fields that passed validation
          const { value: sourceObj, inner } = errors;

          const allKeys = Object.keys(sourceObj)
            .map(each => {
              const value = errors.value[each];
              if (value && typeof value === 'object') {
                return Object.keys(value).map(key => `${each}.${key}`);
              }
              return each;
            })
            .flat();

          allKeys.forEach(key => {
            const field = key.substring(key.indexOf('.') + 1, key.length);
            if (
              inner.some((error: ValidationError) => error.path === key) ||
              !Object.keys(validation.errors).includes(field)
            ) {
              return;
            }
            dispatch(validationActions.removeErrorMessage(field));
          });
        }

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
