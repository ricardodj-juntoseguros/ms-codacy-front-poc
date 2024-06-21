export const getProposalValue = (
  contractValue: number,
  warrantyPercentage: number,
) => {
  return (contractValue / 100) * warrantyPercentage;
};
