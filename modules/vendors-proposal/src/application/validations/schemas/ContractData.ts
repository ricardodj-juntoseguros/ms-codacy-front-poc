import { object, string, number, array, mixed } from 'yup';
import { SearchOptions } from 'junto-design-system';

export const ContractDataSchema = object().shape({
  contractNumber: string().required(),
  contractValue: number().min(1).required(),
  project: mixed().when(['hasProject', 'projectOptionsMapped'], {
    is: (hasProject: boolean, projectOptionsMapped: SearchOptions[]) =>
      hasProject && projectOptionsMapped.length > 0,
    then: mixed().required(),
    otherwise: mixed().notRequired(),
  }),
  projectSearchValue: string().when(['hasProject', 'projectOptionsMapped'], {
    is: (hasProject: boolean, projectOptionsMapped: SearchOptions[]) =>
      hasProject && projectOptionsMapped.length <= 0,
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  files: array().min(1).required(),
});
