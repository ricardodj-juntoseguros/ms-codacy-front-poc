import { object, string, number, array } from 'yup';

export const ContractDataSchema = object().shape({
  contractNumber: string().required(),
  contractValue: number().min(1).required(),
  files: array().min(1).required(),
});
