import { IncentiveTrailStepStatusEnum } from '../application/types/model';

export const incentiveTrailMock = {
  valueAccumulation: 1234,
  conquests: [
    {
      accumulatedValue: 123,
      bonus: 1234,
      isSurprise: false,
      dateStartSurprise: null,
      dateEndSurprise: null,
      percentageCompleted: 80,
      amountLeft: 12,
      status: IncentiveTrailStepStatusEnum.unavailable,
      hasPayment: false,
      paymentAt: null,
      expirationDate: null,
    },
  ],
  dateProduction: '2024-02-21T20:21:55.309Z',
};
