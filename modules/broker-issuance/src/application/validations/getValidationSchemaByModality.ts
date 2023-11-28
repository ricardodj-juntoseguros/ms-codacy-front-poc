import { modalities } from '../../constants/modalities2';
import { getModalityByGroup, getModalityType } from '../../helpers';
import issueSchemas from './schemas/issueSchemas';
import quoteSchemas from './schemas/quoteSchemas';

export const getValidationSchemaByModality = (
  type: 'quote' | 'issue',
  modalityId?: number,
) => {
  let schema = '';

  if (modalityId) {
    const modalityType = getModalityType(modalityId);
    const groupModality = getModalityByGroup(modalityType);
    schema = modalities[groupModality].validationSchema;
  } else {
    schema = 'common';
  }

  switch (type) {
    case 'quote':
      return (quoteSchemas as any)[schema];
    case 'issue':
      return (issueSchemas as any)[schema];
    default:
      return (quoteSchemas as any)[schema];
  }
};
