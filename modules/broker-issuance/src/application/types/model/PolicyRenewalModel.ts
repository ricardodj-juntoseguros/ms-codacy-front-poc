import { CheckboxMultiselectOption } from 'junto-design-system';
import { PolicyRenewalTypeEnum } from './PolicyRenewalTypeEnum';

export interface PolicyDocumentRenewalModel extends CheckboxMultiselectOption {
  id: number;
  description: string;
  hasChoiceOfNumberingType: boolean;
  active: boolean;
  inputValue: string;
  hasOrdinaryNumbering: boolean;
}

export interface PolicyRenewalModel {
  isPolicyRenewal: boolean;
  policyRenewalType: PolicyRenewalTypeEnum;
  mainPolicyNumber: string;
  documentNumber: number | null;
  verifyErrorMessage: string;
  needEndorsement: boolean;
  verifyPolicyLoading: boolean;
  hasPolicyRenewalChanges: boolean;
  documentList: PolicyDocumentRenewalModel[];
  getRenewalDocumentListLoading: boolean;
}
