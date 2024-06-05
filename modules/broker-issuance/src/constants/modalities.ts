import { ModalityTypeEnum, PaymentTypeEnum } from '../application/types/model';

export const DEFAULT_SUBMODALITY_ID = 1;

export const DEFAULT_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID = 90;

export const COVERAGE_LABOR_SUBMODALITY_ID = 26;

export const COVERAGE_LABOR_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID = 92;

export const VARIANT_RETROACTIVE_DATE_MODALITIES = [
  ModalityTypeEnum.JUDICIAL_RECURSAL,
  ModalityTypeEnum.JUDICIAL_FISCAL,
  ModalityTypeEnum.JUDICIAL_DEFAULT,
  ModalityTypeEnum.BIDDER,
];

export const DEFAULT_PAYMENT_TYPE = PaymentTypeEnum.BILL;

export const MODALITY_OTHER_PAYMENT_TYPE: { [x: number]: PaymentTypeEnum } = {
  [ModalityTypeEnum.JUDICIAL_RECURSAL]: PaymentTypeEnum.INVOICE,
};
