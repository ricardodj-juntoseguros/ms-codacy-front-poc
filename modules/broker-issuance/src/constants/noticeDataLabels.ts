import { ModalityTypeEnum } from '../application/types/model';

interface NoticeDataLabels {
  [key: number]: {
    label: string;
    placeholder: string;
  };
}

export const NOTICE_DATA_LABELS: NoticeDataLabels = {
  [ModalityTypeEnum.BIDDER]: {
    label: 'Número do edital',
    placeholder: 'Digite o número do edital',
  },
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]: {
    label: 'Número do edital ou contrato',
    placeholder:
      'Ex. nº 000/0000, oriundo da Concorrência nº 00/0000, firmado em 00/00/0000',
  },
  [ModalityTypeEnum.SUPPLIER_PERFORMER]: {
    label: 'Número do edital ou contrato',
    placeholder:
      'Ex. nº 000/0000, oriundo da Concorrência nº 00/0000, firmado em 00/00/0000',
  },
  [ModalityTypeEnum.BUILDER_PERFORMER]: {
    label: 'Número do edital ou contrato',
    placeholder:
      'Ex. nº 000/0000, oriundo da Concorrência nº 00/0000, firmado em 00/00/0000',
  },
};
