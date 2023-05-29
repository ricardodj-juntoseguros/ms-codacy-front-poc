import { object, string, number } from 'yup';

export const PolicyholderContactSchema = object().shape({
  id: number().notRequired(),
  name: string().required(),
  email: string().email().required(),
  federalId: string().notRequired(),
});
