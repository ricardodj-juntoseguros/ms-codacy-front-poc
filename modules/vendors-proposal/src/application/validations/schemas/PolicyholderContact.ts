import { object, string } from 'yup';

export const PolicyholderContactSchema = object().shape({
  id: string().notRequired(),
  name: string().required(),
  email: string().email().required(),
});
