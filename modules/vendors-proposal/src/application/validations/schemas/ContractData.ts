import { object, string, number, array } from 'yup';

export const ContractDataSchema = object().shape({
  contractNumber: string().required(),
  contractValue: number().min(1).required(),
  projectSearchValue: string().when(['hasProject'], {
    is: (hasProject: boolean) => hasProject,
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  files: array().min(1).required(),
});
