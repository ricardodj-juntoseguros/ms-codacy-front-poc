export interface TimeframeAndCoverageModel {
  timeframeStart: Date | null;
  timeframeEnd: Date | null;
  durationInDays: number;
  coverageValue: number;
  policyholderLimit: number;
}
