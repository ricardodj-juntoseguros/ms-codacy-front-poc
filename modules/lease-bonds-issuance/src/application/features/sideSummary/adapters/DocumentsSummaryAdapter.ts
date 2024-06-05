import { ProposalDocumentsModel } from '../../../types/model';

export const documentsSummaryAdapter = (
  appointmentLetter: { filename: string; size: number } | null,
  proposalDocuments: ProposalDocumentsModel['proposalDocuments'],
) => {
  const result = [] as { filename: string; size: string }[];
  const sizeCalc = (size: number) => `${(size / 1048576).toFixed(2)} MB`;

  if (appointmentLetter) {
    const { filename, size } = appointmentLetter;
    result.push({
      filename,
      size: sizeCalc(size),
    });
  }
  proposalDocuments.forEach(({ name, size }) => {
    result.push({
      filename: name,
      size: sizeCalc(size),
    });
  });
  return result;
};
