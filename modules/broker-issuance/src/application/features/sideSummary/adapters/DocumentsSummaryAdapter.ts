import { ProposalDocumentDTO } from '../../../types/dto';

export const documentsSummaryAdapter = (
  appointmentLetter: { filename: string; size: number } | null,
  proposalDocuments: ProposalDocumentDTO[],
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
  proposalDocuments.forEach(({ filename, size }) => {
    result.push({
      filename,
      size: sizeCalc(size),
    });
  });
  return result;
};
