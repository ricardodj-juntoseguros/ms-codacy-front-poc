import { mixed, object } from 'yup';

export const SearchValidationSchema = object().shape({
  policyholder: mixed().required(),
  modality: mixed().required(),
  subsidiary: mixed().notRequired(),
});
